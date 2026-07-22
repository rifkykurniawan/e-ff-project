from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.dependencies.auth_dep import get_current_user
from app.schemas.reports import DashboardEnvelopeResponse
from app.services.reports_service import ReportsService
from app.models.user import User

router = APIRouter(prefix="/reports", tags=["Reports & Dashboard"])

@router.get(
    "/dashboard",
    response_model=DashboardEnvelopeResponse,
    summary="Get aggregated metrics for the family dashboard"
)
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reports_service = ReportsService(db)
    metrics = await reports_service.get_dashboard_metrics()
    return DashboardEnvelopeResponse(
        success=True,
        message="Dashboard metrics loaded successfully",
        data=metrics
    )
