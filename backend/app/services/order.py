import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.exceptions import BadRequestException, NotFoundException, ForbiddenException
from app.models.cart import CartItem
from app.models.order import Order, OrderItem
from app.models.product import Product

logger = logging.getLogger(__name__)


async def checkout(
    db: AsyncSession,
    user_id: int,
    shipping_address: str,
    billing_address: str,
) -> Order:
    # Get cart items
    result = await db.execute(
        select(CartItem)
        .where(CartItem.user_id == user_id)
        .options(joinedload(CartItem.product))
    )
    cart_items = result.scalars().all()

    if not cart_items:
        raise BadRequestException(detail="Cart is empty")

    # Validate stock and calculate total
    total_amount = 0.0
    order_items_data = []

    for cart_item in cart_items:
        product = cart_item.product
        if not product.is_active:
            raise BadRequestException(
                detail=f"Product '{product.name}' is no longer available"
            )
        if cart_item.quantity > product.stock_quantity:
            raise BadRequestException(
                detail=f"Insufficient stock for '{product.name}'. Available: {product.stock_quantity}"
            )

        subtotal = round(product.price * cart_item.quantity, 2)
        total_amount += subtotal
        order_items_data.append({
            "product_id": product.id,
            "quantity": cart_item.quantity,
            "unit_price": product.price,
            "subtotal": subtotal,
        })

    # Create order
    order = Order(
        user_id=user_id,
        total_amount=round(total_amount, 2),
        status="confirmed",
        shipping_address=shipping_address,
        billing_address=billing_address,
    )
    db.add(order)
    await db.flush()

    # Create order items and decrement stock
    for item_data in order_items_data:
        order_item = OrderItem(order_id=order.id, **item_data)
        db.add(order_item)

        # Decrement stock
        result = await db.execute(
            select(Product).where(Product.id == item_data["product_id"])
        )
        product = result.scalar_one()
        product.stock_quantity -= item_data["quantity"]

    # Clear cart
    for cart_item in cart_items:
        await db.delete(cart_item)

    await db.commit()
    await db.refresh(order)

    # Load order with items for response
    result = await db.execute(
        select(Order)
        .where(Order.id == order.id)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
    )
    order = result.unique().scalar_one()

    logger.info("Order created: id=%d, user=%d, total=%.2f", order.id, user_id, total_amount)
    return order


async def get_user_orders(db: AsyncSession, user_id: int) -> list[Order]:
    result = await db.execute(
        select(Order)
        .where(Order.user_id == user_id)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .order_by(Order.created_at.desc())
    )
    return result.unique().scalars().all()


async def get_order_detail(db: AsyncSession, user_id: int, order_id: int) -> Order:
    result = await db.execute(
        select(Order)
        .where(Order.id == order_id)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
    )
    order = result.unique().scalar_one_or_none()
    if not order:
        raise NotFoundException(detail=f"Order with id {order_id} not found")
    if order.user_id != user_id:
        raise ForbiddenException(detail="You do not have access to this order")
    return order
