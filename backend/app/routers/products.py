from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.schemas.product import ProductResponse, ProductList
from app.services.product import get_products, get_product_by_id

router = APIRouter(prefix="/api/v1/products", tags=["products"])


@router.get("", response_model=ProductList)
async def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = None,
    category: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    return await get_products(db, page=page, page_size=page_size, search=search, category=category)


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    return await get_product_by_id(db, product_id)
