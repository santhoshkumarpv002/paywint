import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product


@pytest_asyncio.fixture
async def sample_product(db_session: AsyncSession) -> Product:
    product = Product(
        name="Test Widget",
        description="A test product",
        price=29.99,
        stock_quantity=100,
        category="electronics",
        image_url="https://example.com/widget.jpg",
        is_active=True,
    )
    db_session.add(product)
    await db_session.commit()
    await db_session.refresh(product)
    return product


@pytest.mark.asyncio
async def test_list_products_empty(client: AsyncClient):
    response = await client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0


@pytest.mark.asyncio
async def test_list_products(client: AsyncClient, sample_product):
    response = await client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "Test Widget"


@pytest.mark.asyncio
async def test_get_product_by_id(client: AsyncClient, sample_product):
    response = await client.get(f"/api/v1/products/{sample_product.id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Test Widget"


@pytest.mark.asyncio
async def test_get_product_not_found(client: AsyncClient):
    response = await client.get("/api/v1/products/999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_search_products(client: AsyncClient, sample_product):
    response = await client.get("/api/v1/products", params={"search": "Widget"})
    assert response.status_code == 200
    assert response.json()["total"] == 1


@pytest.mark.asyncio
async def test_filter_by_category(client: AsyncClient, sample_product):
    response = await client.get("/api/v1/products", params={"category": "electronics"})
    assert response.status_code == 200
    assert response.json()["total"] == 1

    response = await client.get("/api/v1/products", params={"category": "clothing"})
    assert response.json()["total"] == 0


@pytest.mark.asyncio
async def test_admin_create_product(client: AsyncClient, admin_headers):
    response = await client.post("/api/v1/admin/products", json={
        "name": "New Product",
        "description": "Brand new",
        "price": 49.99,
        "stock_quantity": 50,
        "category": "gadgets",
    }, headers=admin_headers)
    assert response.status_code == 201
    assert response.json()["name"] == "New Product"


@pytest.mark.asyncio
async def test_non_admin_cannot_create_product(client: AsyncClient, auth_headers):
    response = await client.post("/api/v1/admin/products", json={
        "name": "New Product",
        "price": 49.99,
        "stock_quantity": 50,
    }, headers=auth_headers)
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_admin_update_product(client: AsyncClient, admin_headers, sample_product):
    response = await client.put(
        f"/api/v1/admin/products/{sample_product.id}",
        json={"price": 19.99},
        headers=admin_headers,
    )
    assert response.status_code == 200
    assert response.json()["price"] == 19.99


@pytest.mark.asyncio
async def test_admin_delete_product(client: AsyncClient, admin_headers, sample_product):
    response = await client.delete(
        f"/api/v1/admin/products/{sample_product.id}",
        headers=admin_headers,
    )
    assert response.status_code == 200
    assert response.json()["is_active"] is False


@pytest.mark.asyncio
async def test_create_product_negative_price(client: AsyncClient, admin_headers):
    response = await client.post("/api/v1/admin/products", json={
        "name": "Bad Product",
        "price": -10.0,
        "stock_quantity": 5,
    }, headers=admin_headers)
    assert response.status_code == 422
