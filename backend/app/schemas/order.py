from datetime import datetime
from pydantic import BaseModel, Field


class OrderCreate(BaseModel):
    shipping_address: str = Field(min_length=1, max_length=500)
    billing_address: str = Field(min_length=1, max_length=500)


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    subtotal: float
    product_name: str = ""

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    shipping_address: str
    billing_address: str
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemResponse] = []

    model_config = {"from_attributes": True}
