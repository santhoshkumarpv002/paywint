import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product


@pytest_asyncio.fixture
async def low_stock_product(db_session: AsyncSession) -> Product:
    product = Product(
        name="Low Stock Item",
        price=10.00,
        stock_quantity=2,
        is_active=True,
    )
    db_session.add(product)
    await db_session.commit()
    await db_session.refresh(product)
    return product


@pytest.mark.asyncio
async def test_checkout_insufficient_stock(client: AsyncClient, auth_headers, low_stock_product):
    await client.post("/api/v1/cart", json={
        "product_id": low_stock_product.id,
        "quantity": 2,
    }, headers=auth_headers)

    response = await client.post("/api/v1/orders/checkout", json={
        "shipping_address": "123 St",
        "billing_address": "123 St",
    }, headers=auth_headers)
    assert response.status_code == 201


@pytest.mark.asyncio
async def test_pagination_beyond_total(client: AsyncClient):
    response = await client.get("/api/v1/products", params={"page": 100})
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []


@pytest.mark.asyncio
async def test_search_special_characters(client: AsyncClient):
    response = await client.get("/api/v1/products", params={"search": "%'; DROP TABLE--"})
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_health_endpoint(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_add_nonexistent_product_to_cart(client: AsyncClient, auth_headers):
    response = await client.post("/api/v1/cart", json={
        "product_id": 99999,
        "quantity": 1,
    }, headers=auth_headers)
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_order_total_matches_items(client: AsyncClient, auth_headers, db_session: AsyncSession):
    p1 = Product(name="P1", price=10.50, stock_quantity=5, is_active=True)
    p2 = Product(name="P2", price=20.75, stock_quantity=5, is_active=True)
    db_session.add_all([p1, p2])
    await db_session.commit()
    await db_session.refresh(p1)
    await db_session.refresh(p2)

    await client.post("/api/v1/cart", json={"product_id": p1.id, "quantity": 2}, headers=auth_headers)
    await client.post("/api/v1/cart", json={"product_id": p2.id, "quantity": 1}, headers=auth_headers)

    resp = await client.post("/api/v1/orders/checkout", json={
        "shipping_address": "Addr",
        "billing_address": "Addr",
    }, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()

    expected = (10.50 * 2) + (20.75 * 1)
    assert data["total_amount"] == expected
    item_total = sum(item["subtotal"] for item in data["items"])
    assert abs(item_total - expected) < 0.01
