import uuid
from datetime import date
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession

class ReportsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_dashboard_data(self) -> Dict[str, Any]:
        # Return realistic mock data representing a family dashboard.
        # This will be replaced with real SQLAlchemy aggregation queries in subsequent milestones
        # once the respective database models (Account, Transaction, Budget, SavingGoal) are built.
        return {
            "total_balance": 15350000.00,
            "income_this_month": 25000000.00,
            "expense_this_month": 2800000.00,
            "net_balance": 22200000.00,
            "saving_goals": [
                {
                    "name": "Japan Trip 2027",
                    "progress_percentage": 25.0
                },
                {
                    "name": "Emergency Fund",
                    "progress_percentage": 60.0
                },
                {
                    "name": "New Car Fund",
                    "progress_percentage": 12.5
                }
            ],
            "recent_transactions": [
                {
                    "id": uuid.UUID("e8a930b8-c3d2-45e6-bf8a-c9d3a1f8b89d"),
                    "description": "Weekly grocery shopping",
                    "amount": 450000.00,
                    "type": "Expense",
                    "date": date(2026, 7, 22)
                },
                {
                    "id": uuid.UUID("f9a930b8-c3d2-45e6-bf8a-c9d3a1f8b89e"),
                    "description": "Monthly Salary",
                    "amount": 25000000.00,
                    "type": "Income",
                    "date": date(2026, 7, 20)
                },
                {
                    "id": uuid.UUID("01a930b8-c3d2-45e6-bf8a-c9d3a1f8b89f"),
                    "description": "Transfer to Savings",
                    "amount": 2000000.00,
                    "type": "Transfer",
                    "date": date(2026, 7, 19)
                },
                {
                    "id": uuid.UUID("02a930b8-c3d2-45e6-bf8a-c9d3a1f8b89a"),
                    "description": "Electricity Bill",
                    "amount": 1200000.00,
                    "type": "Expense",
                    "date": date(2026, 7, 15)
                },
                {
                    "id": uuid.UUID("03a930b8-c3d2-45e6-bf8a-c9d3a1f8b89b"),
                    "description": "Dinner at Restaurant",
                    "amount": 1150000.00,
                    "type": "Expense",
                    "date": date(2026, 7, 12)
                }
            ],
            "budget_summary": [
                {
                    "category_name": "Groceries",
                    "planned": 2000000.00,
                    "actual": 450000.00,
                    "remaining": 1550000.00
                },
                {
                    "category_name": "Utilities",
                    "planned": 1500000.00,
                    "actual": 1200000.00,
                    "remaining": 300000.00
                },
                {
                    "category_name": "Dining Out",
                    "planned": 1000000.00,
                    "actual": 1150000.00,
                    "remaining": -150000.00
                }
            ]
        }
