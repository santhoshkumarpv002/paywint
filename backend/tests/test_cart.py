import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product


@pytest_asyncio.fixture
async def cart_product(db_session: AsyncSession) -> Product:
    product = Product(
        name="Cart Test Product",
        description="For cart testing",
        price=25.00,
        stock_quantity=10,
        category="test",
        is_active=True,
    )
    db_session.add(product)
    await db_session.commit()
    await db_session.refresh(product)
    return product


@pytest_asyncio.fixture
async def inactive_product(db_session: AsyncSession) -> Product:
    product = Product(
        name="Inactive Product",
        price=15.00,
        stock_quantity=5,
        is_active=False,
    )
    db_session.add(product)
    await db_session.commit()
    await db_session.refresh(product)
    return product


@pytest.mark.asyncio
async def test_get_empty_cart(client: AsyncClient, auth_headers):
    response = await client.get("/api/v1/cart", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0.0


@pytest.mark.asyncio
async def test_add_to_cart(client: AsyncClient, auth_headers, cart_product):
    response = await client.post("/api/v1/cart", json={
        "product_id": cart_product.id,
        "quantity": 2,
    }, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["quantity"] == 2
    assert data["total"] == 50.00


@pytest.mark.asyncio
async def test_add_same_product_increments_quantity(client: AsyncClient, auth_headers, cart_product):
    await client.post("/api/v1/cart", json={
        "product_id": cart_product.id, "quantity": 2,
    }, headers=auth_headers)
    response = await client.post("/api/v1/cart", json={
        "product_id": cart_product.id, "quantity": 3,
    }, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["items"][0]["quantity"] == 5


@pytest.mark.asyncio
async def test_add_exceeding_stock(client: AsyncClient, auth_headers, cart_product):
    response = await client.post("/api/v1/cart", json={
        "product_id": cart_product.id, "quantity": 999,
    }, headers=auth_headers)
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_add_inactive_product(client: AsyncClient, auth_headers, inactive_product):
    response = await client.post("/api/v1/cart", json={
        "product_id": inactive_product.id, "quantity": 1,
    }, headers=auth_headers)
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_update_cart_item_quantity(client: AsyncClient, auth_headers, cart_product):
    resp = await client.post("/api/v1/cart", json={
        "product_id": cart_product.id, "quantity": 2,
    }, headers=auth_headers)
    item_id = resp.json()["items"][0]["id"]

    response = await client.patch(f"/api/v1/cart/{item_id}", json={
        "quantity": 5,
    }, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["items"][0]["quantity"] == 5


@pytest.mark.asyncio
async def test_update_quantity_to_zero_removes(client: AsyncClient, auth_headers, cart_product):
    resp = await client.post("/api/v1/cart", json={
        "product_id": cart_product.id, "quantity": 2,
    }, headers=auth_headers)
    item_id = resp.json()["items"][0]["id"]

    response = await client.patch(f"/api/v1/cart/{item_id}", json={
        "quantity": 0,
    }, headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()["items"]) == 0


@pytest.mark.asyncio
async def test_remove_cart_item(client: AsyncClient, auth_headers, cart_product):
    resp = await client.post("/api/v1/cart", json={
        "product_id": cart_product.id, "quantity": 1,
    }, headers=auth_headers)
    item_id = resp.json()["items"][0]["id"]

    response = await client.delete(f"/api/v1/cart/{item_id}", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()["items"]) == 0


@pytest.mark.asyncio
async def test_clear_cart(client: AsyncClient, auth_headers, cart_product):
    await client.post("/api/v1/cart", json={
        "product_id": cart_product.id, "quantity": 1,
    }, headers=auth_headers)

    response = await client.delete("/api/v1/cart", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()["items"]) == 0


@pytest.mark.asyncio
async def test_cart_unauthenticated(client: AsyncClient):
    response = await client.get("/api/v1/cart")
    assert response.status_code in (401, 403)
