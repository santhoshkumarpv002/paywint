import logging
from math import ceil

from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import NotFoundException
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductList, ProductResponse

logger = logging.getLogger(__name__)


async def get_products(
    db: AsyncSession,
    page: int = 1,
    page_size: int = 20,
    search: str | None = None,
    category: str | None = None,
    active_only: bool = True,
) -> ProductList:
    query = select(Product)
    count_query = select(func.count(Product.id))

    if active_only:
        query = query.where(Product.is_active == True)
        count_query = count_query.where(Product.is_active == True)

    if search:
        search_filter = or_(
            Product.name.ilike(f"%{search}%"),
            Product.description.ilike(f"%{search}%"),
        )
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)

    if category:
        query = query.where(Product.category == category)
        count_query = count_query.where(Product.category == category)

    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size).order_by(Product.created_at.desc())
    result = await db.execute(query)
    products = result.scalars().all()

    return ProductList(
        items=[ProductResponse.model_validate(p) for p in products],
        total=total,
        page=page,
        page_size=page_size,
        pages=ceil(total / page_size) if page_size > 0 else 0,
    )


async def get_product_by_id(db: AsyncSession, product_id: int) -> Product:
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise NotFoundException(detail=f"Product with id {product_id} not found")
    return product


async def create_product(db: AsyncSession, data: ProductCreate) -> Product:
    product = Product(**data.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    logger.info("Product created: %s (id=%d)", product.name, product.id)
    return product


async def update_product(db: AsyncSession, product_id: int, data: ProductUpdate) -> Product:
    product = await get_product_by_id(db, product_id)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
    await db.commit()
    await db.refresh(product)
    logger.info("Product updated: id=%d", product_id)
    return product


async def soft_delete_product(db: AsyncSession, product_id: int) -> Product:
    product = await get_product_by_id(db, product_id)
    product.is_active = False
    await db.commit()
    await db.refresh(product)
    logger.info("Product soft-deleted: id=%d", product_id)
    return product
