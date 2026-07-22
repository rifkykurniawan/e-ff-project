from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.reports_repository import ReportsRepository
from app.schemas.reports import DashboardData

class ReportsService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.reports_repo = ReportsRepository(db)

    async def get_dashboard_metrics(self) -> DashboardData:
        data = await self.reports_repo.get_dashboard_data()
        return DashboardData(**data)
