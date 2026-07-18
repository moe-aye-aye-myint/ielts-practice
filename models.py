from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class User(UserMixin, db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(db.String(100))

    email = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255),
        nullable=False
    )

    membership = db.Column(
        db.String(20),
        default="free"
    )

    is_verified = db.Column(
    db.Boolean,
    default=False
)
    verification_token = db.Column(
    db.String(100),
    unique=True
)
    is_admin = db.Column(
    db.Boolean,
    default=False
    )

class Payment(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )


    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id")
    )


    slip = db.Column(
        db.String(200)
    )


    status = db.Column(
        db.String(20),
        default="pending"
    )


    user = db.relationship(
        "User",
        backref="payments"
    )
    