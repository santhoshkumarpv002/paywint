from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, require_admin
from app.models.user import User
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.services.product import create_product, update_product, soft_delete_product

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])


@router.post("/products", response_model=ProductResponse, status_code=201)
async def admin_create_product(
    data: ProductCreate,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    return await create_product(db, data)


@router.put("/products/{product_id}", response_model=ProductResponse)
async def admin_update_product(
    product_id: int,
    data: ProductUpdate,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    return await update_product(db, product_id, data)


@router.delete("/products/{product_id}", response_model=ProductResponse)
async def admin_delete_product(
    product_id: int,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    return await soft_delete_product(db, product_id)
