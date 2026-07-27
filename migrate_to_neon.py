import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from models import User, Payment


# Local SQLite
sqlite_engine = create_engine(
    "sqlite:///instance/database.db"
)

SQLiteSession = sessionmaker(
    bind=sqlite_engine
)


# Neon PostgreSQL
NEON_DATABASE_URL = "postgresql://neondb_owner:npg_StaeqWYH84Nw@ep-wispy-thunder-azwdvj26-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

postgres_engine = create_engine(
    NEON_DATABASE_URL
)

PostgresSession = sessionmaker(
    bind=postgres_engine
)


sqlite = SQLiteSession()
postgres = PostgresSession()


# Copy Users

users = sqlite.query(User).all()

for user in users:

    existing = postgres.query(User).filter_by(
        email=user.email
    ).first()

    if not existing:

        new_user = User(
            id=user.id,
            name=user.name,
            email=user.email,
            password=user.password,
            membership=user.membership,
            is_verified=user.is_verified,
            verification_token=user.verification_token,
            is_admin=user.is_admin
        )

        postgres.add(new_user)


postgres.commit()


# Copy Payments

payments = sqlite.query(Payment).all()

for payment in payments:

    new_payment = Payment(
        id=payment.id,
        user_id=payment.user_id,
        slip=payment.slip,
        status=payment.status
    )

    postgres.add(new_payment)


postgres.commit()


print("Migration complete!")

print(
    "Users:",
    postgres.query(User).count()
)

print(
    "Payments:",
    postgres.query(Payment).count()
)
