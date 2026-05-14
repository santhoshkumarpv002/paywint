from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse, OrderItemResponse
from app.services.order import checkout, get_user_orders, get_order_detail

router = APIRouter(prefix="/api/v1/orders", tags=["orders"])


def _order_to_response(order) -> OrderResponse:
    items = []
    for item in order.items:
        product_name = item.product.name if item.product else ""
        items.append(
            OrderItemResponse(
                id=item.id,
                product_id=item.product_id,
                quantity=item.quantity,
                unit_price=item.unit_price,
                subtotal=item.subtotal,
                product_name=product_name,
            )
        )
    return OrderResponse(
        id=order.id,
        user_id=order.user_id,
        total_amount=order.total_amount,
        status=order.status,
        shipping_address=order.shipping_address,
        billing_address=order.billing_address,
        created_at=order.created_at,
        updated_at=order.updated_at,
        items=items,
    )


@router.post("/checkout", response_model=OrderResponse, status_code=201)
async def create_order(
    data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    order = await checkout(db, current_user.id, data.shipping_address, data.billing_address)
    return _order_to_response(order)


@router.get("", response_model=list[OrderResponse])
async def list_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    orders = await get_user_orders(db, current_user.id)
    return [_order_to_response(o) for o in orders]


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    order = await get_order_detail(db, current_user.id, order_id)
    return _order_to_response(order)
