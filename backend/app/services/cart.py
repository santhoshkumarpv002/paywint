import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.exceptions import BadRequestException, NotFoundException
from app.models.cart import CartItem
from app.models.product import Product
from app.schemas.cart import CartResponse, CartItemResponse
from app.schemas.product import ProductResponse

logger = logging.getLogger(__name__)


async def get_cart(db: AsyncSession, user_id: int) -> CartResponse:
    result = await db.execute(
        select(CartItem)
        .where(CartItem.user_id == user_id)
        .options(joinedload(CartItem.product))
    )
    items = result.scalars().all()

    cart_items = []
    total = 0.0
    for item in items:
        subtotal = item.product.price * item.quantity
        total += subtotal
        cart_items.append(
            CartItemResponse(
                id=item.id,
                product_id=item.product_id,
                quantity=item.quantity,
                product=ProductResponse.model_validate(item.product),
            )
        )

    return CartResponse(items=cart_items, total=round(total, 2), item_count=len(cart_items))


async def add_to_cart(db: AsyncSession, user_id: int, product_id: int, quantity: int) -> CartResponse:
    # Validate product
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise NotFoundException(detail="Product not found")
    if not product.is_active:
        raise BadRequestException(detail="Product is not available")
    if quantity > product.stock_quantity:
        raise BadRequestException(detail="Requested quantity exceeds available stock")

    # Check if item already in cart
    result = await db.execute(
        select(CartItem).where(
            CartItem.user_id == user_id,
            CartItem.product_id == product_id,
        )
    )
    existing = result.scalar_one_or_none()

    if existing:
        new_qty = existing.quantity + quantity
        if new_qty > product.stock_quantity:
            raise BadRequestException(detail="Total quantity exceeds available stock")
        existing.quantity = new_qty
    else:
        cart_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.add(cart_item)

    await db.commit()
    logger.info("Cart updated for user %d: product %d, qty %d", user_id, product_id, quantity)
    return await get_cart(db, user_id)


async def update_cart_item(db: AsyncSession, user_id: int, item_id: int, quantity: int) -> CartResponse:
    result = await db.execute(
        select(CartItem).where(CartItem.id == item_id, CartItem.user_id == user_id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise NotFoundException(detail="Cart item not found")

    if quantity == 0:
        await db.delete(item)
    else:
        # Validate stock
        result = await db.execute(select(Product).where(Product.id == item.product_id))
        product = result.scalar_one_or_none()
        if product and quantity > product.stock_quantity:
            raise BadRequestException(detail="Requested quantity exceeds available stock")
        item.quantity = quantity

    await db.commit()
    return await get_cart(db, user_id)


async def remove_cart_item(db: AsyncSession, user_id: int, item_id: int) -> CartResponse:
    result = await db.execute(
        select(CartItem).where(CartItem.id == item_id, CartItem.user_id == user_id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise NotFoundException(detail="Cart item not found")
    await db.delete(item)
    await db.commit()
    return await get_cart(db, user_id)


async def clear_cart(db: AsyncSession, user_id: int) -> CartResponse:
    result = await db.execute(select(CartItem).where(CartItem.user_id == user_id))
    items = result.scalars().all()
    for item in items:
        await db.delete(item)
    await db.commit()
    return await get_cart(db, user_id)
