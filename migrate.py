from app import app
from models import db, User, Payment
from sqlalchemy import create_engine


with app.app_context():

    users = User.query.all()
    payments = Payment.query.all()

    print("Users:", len(users))
    print("Payments:", len(payments))
    