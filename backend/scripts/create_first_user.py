import sys
import os
import asyncio

# Add backend directory to python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import async_session_maker
from app.repositories.user_repository import UserRepository
from app.schemas.user_schema import UserCreate

async def seed_user():
    print("Seeding first user...")
    async with async_session_maker() as session:
        user_repo = UserRepository(session)
        
        # Check if user already exists
        email = "family@example.com"
        existing_user = await user_repo.get_by_email(email)
        if existing_user:
            print(f"User {email} already exists.")
            return
        
        user_in = UserCreate(
            email=email,
            password="Password123",
            first_name="Family",
            last_name="Member"
        )
        
        await user_repo.create(user_in)
        await session.commit()
        print(f"Successfully seeded default user: {email} / Password123")

if __name__ == "__main__":
    asyncio.run(seed_user())
