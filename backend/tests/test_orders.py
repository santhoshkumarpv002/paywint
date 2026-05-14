import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product


@pytest_asyncio.fixture
async def order_product(db_session: AsyncSession) -> Product:
    product = Product(
        name="Order Test Product",
        description="For order testing",
        price=50.00,
        stock_quantity=20,
        category="test",
        is_active=True,
    )
    db_session.add(product)
    await db_session.commit()
    await db_session.refresh(product)
    return product


@pytest.mark.asyncio
async def test_checkout_success(client: AsyncClient, auth_headers, order_product):
    await client.post("/api/v1/cart", json={
        "product_id": order_product.id, "quantity": 2,
    }, headers=auth_headers)

    response = await client.post("/api/v1/orders/checkout", json={
        "shipping_address": "123 Test St",
        "billing_address": "123 Test St",
    }, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["total_amount"] == 100.00
    assert data["status"] == "confirmed"
    assert len(data["items"]) == 1


@pytest.mark.asyncio
async def test_checkout_empty_cart(client: AsyncClient, auth_headers):
    response = await client.post("/api/v1/orders/checkout", json={
        "shipping_address": "123 Test St",
        "billing_address": "123 Test St",
    }, headers=auth_headers)
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_checkout_clears_cart(client: AsyncClient, auth_headers, order_product):
    await client.post("/api/v1/cart", json={
        "product_id": order_product.id, "quantity": 1,
    }, headers=auth_headers)

    await client.post("/api/v1/orders/checkout", json={
        "shipping_address": "123 Test St",
        "billing_address": "123 Test St",
    }, headers=auth_headers)

    cart_resp = await client.get("/api/v1/cart", headers=auth_headers)
    assert len(cart_resp.json()["items"]) == 0


@pytest.mark.asyncio
async def test_checkout_decrements_stock(client: AsyncClient, auth_headers, order_product):
    await client.post("/api/v1/cart", json={
        "product_id": order_product.id, "quantity": 3,
    }, headers=auth_headers)

    await client.post("/api/v1/orders/checkout", json={
        "shipping_address": "123 Test St",
        "billing_address": "123 Test St",
    }, headers=auth_headers)

    prod_resp = await client.get(f"/api/v1/products/{order_product.id}")
    assert prod_resp.json()["stock_quantity"] == 17


@pytest.mark.asyncio
async def test_list_orders(client: AsyncClient, auth_headers, order_product):
    await client.post("/api/v1/cart", json={
        "product_id": order_product.id, "quantity": 1,
    }, headers=auth_headers)
    await client.post("/api/v1/orders/checkout", json={
        "shipping_address": "123 Test St",
        "billing_address": "123 Test St",
    }, headers=auth_headers)

    response = await client.get("/api/v1/orders", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


@pytest.mark.asyncio
async def test_get_order_detail(client: AsyncClient, auth_headers, order_product):
    await client.post("/api/v1/cart", json={
        "product_id": order_product.id, "quantity": 2,
    }, headers=auth_headers)
    checkout_resp = await client.post("/api/v1/orders/checkout", json={
        "shipping_address": "456 Order Ave",
        "billing_address": "456 Order Ave",
    }, headers=auth_headers)
    order_id = checkout_resp.json()["id"]

    response = await client.get(f"/api/v1/orders/{order_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == order_id
    assert response.json()["shipping_address"] == "456 Order Ave"


@pytest.mark.asyncio
async def test_get_order_not_found(client: AsyncClient, auth_headers):
    response = await client.get("/api/v1/orders/999", headers=auth_headers)
    assert response.status_code == 404
