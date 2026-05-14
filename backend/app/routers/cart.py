from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.cart import CartItemAdd, CartItemUpdate, CartResponse
from app.services.cart import get_cart, add_to_cart, update_cart_item, remove_cart_item, clear_cart

router = APIRouter(prefix="/api/v1/cart", tags=["cart"])


@router.get("", response_model=CartResponse)
async def get_user_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_cart(db, current_user.id)


@router.post("", response_model=CartResponse)
async def add_item(
    data: CartItemAdd,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await add_to_cart(db, current_user.id, data.product_id, data.quantity)


@router.patch("/{item_id}", response_model=CartResponse)
async def update_item(
    item_id: int,
    data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await update_cart_item(db, current_user.id, item_id, data.quantity)


@router.delete("/{item_id}", response_model=CartResponse)
async def remove_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await remove_cart_item(db, current_user.id, item_id)


@router.delete("", response_model=CartResponse)
async def clear_user_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await clear_cart(db, current_user.id)
