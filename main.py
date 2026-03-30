from fastapi import FastAPI, Depends
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
from db import get_db, engine, ExpenseModel, Base
from sqlalchemy import select


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

    await engine.dispose()


app = FastAPI(
    title="Expense Management Application", lifespan=lifespan, prefix="/api/v1"
)


# app.starup depreacted#


class Expense(BaseModel):
    name: str = Field(example="Groceries", min_length=3)
    amount: float = Field(min=0, example=150.75)
    category: str = Field(example="Food", min_length=3)


# 2. Updated Endpoint
@app.post("/expenses/")
async def create_expense(expense_data: Expense, db: AsyncSession = Depends(get_db)):
    async with db.begin():
        new_expense = ExpenseModel(expense_data)
        db.add(new_expense)
    await db.refresh(new_expense)
    return new_expense


# 3. Get Expenses Endpoint
@app.get("/expenses")
async def get_expenses(db: AsyncSession = Depends(get_db)):
    async with db.begin():
        result = await db.execute(select(ExpenseModel))
        expenses = result.scalars().all()
    return expenses


@app.get("/expenses")
async def get_expenses(db: AsyncSession = Depends(get_db)):

    async with db.begin():
        result = await db.execute("SELECT * FROM expenses")
        expenses = result.fetchall()
    return expenses


@app.get("/expenses/month/{year}/{month}")
async def get_expenses_by_month(year: int, month: int):
    pass


@app.get("/total")
async def get_total_expenses():
    pass
