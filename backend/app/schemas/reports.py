import uuid
from datetime import date
from typing import List, Optional
from pydantic import BaseModel

class DashboardSavingGoal(BaseModel):
    name: str
    progress_percentage: float

class DashboardTransaction(BaseModel):
    id: uuid.UUID
    description: str
    amount: float
    type: str  # Income, Expense, Transfer
    date: date

class DashboardBudget(BaseModel):
    category_name: str
    planned: float
    actual: float
    remaining: float

class DashboardData(BaseModel):
    total_balance: float
    income_this_month: float
    expense_this_month: float
    net_balance: float
    recent_transactions: List[DashboardTransaction]
    saving_goals: List[DashboardSavingGoal]
    budget_summary: List[DashboardBudget]

class DashboardEnvelopeResponse(BaseModel):
    success: bool = True
    message: str = "Dashboard metrics loaded"
    data: DashboardData
