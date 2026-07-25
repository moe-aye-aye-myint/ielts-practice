from flask import Flask, render_template, request, redirect, url_for, flash
from models import db, User, Payment
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash
import json
import os

app = Flask(__name__)

app.config["UPLOAD_FOLDER"] = "static/payment_slips"

app.config["SECRET_KEY"] = "replace_this_with_a_random_secret"

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

login_manager = LoginManager()

login_manager.init_app(app)

login_manager.login_view = "login"


with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):

    return User.query.get(int(user_id))

def calculate_band(score):

    if score >= 39:
        return 9

    elif score >= 37:
        return 8.5

    elif score >= 35:
        return 8

    elif score >= 33:
        return 7.5

    elif score >= 30:
        return 7

    elif score >= 27:
        return 6.5

    elif score >= 23:
        return 6

    elif score >= 19:
        return 5.5

    else:
        return 5

@app.route("/admin")
@login_required
def admin():

    if not current_user.is_admin:
        return "Access denied"


    users = User.query.all()

    payments = Payment.query.all()


    return render_template(
        "admin.html",
        users=users,
        payments=payments
    )

@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        name = request.form["name"]

        email = request.form["email"]

        password = request.form["password"]


        existing_user = User.query.filter_by(
            email=email
        ).first()


        if existing_user:

            flash("Email already registered.")

            return redirect(
                url_for("register")
            )


        hashed_password = generate_password_hash(
            password
        )


        new_user = User(
            name=name,
            email=email,
            password=hashed_password
        )


        db.session.add(new_user)

        db.session.commit()


        flash("Registration successful. Please login.")


        return redirect(
            url_for("login")
        )


    return render_template(
        "register.html"
    )

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form["email"]

        password = request.form["password"]


        user = User.query.filter_by(
            email=email
        ).first()


        if user and check_password_hash(
            user.password,
            password
        ):

            login_user(user)

            return redirect(
                url_for("home")
            )


        else:

            flash(
                "Invalid email or password."
            )


    return render_template(
        "login.html"
    )
@app.route("/logout")
@login_required
def logout():

    logout_user()

    return redirect(
        url_for("home")
    )

@app.route("/")
def home():

    return render_template("home.html")



@app.route('/reading-test')
def reading_list():

    with open('data/tests.json') as file:
        tests = json.load(file)


    return render_template(
        'reading_list.html',
        tests=tests
    )



@app.route('/instructions/<test_id>')
def instructions(test_id):

    with open(f'data/{test_id}.json') as file:
        test = json.load(file)


    return render_template(
        'instructions.html',
        test=test
    )



@app.route('/reading/<test_id>')
@login_required
def reading(test_id):

    free_tests = [
        "reading_test1"
    ]


    if (
        test_id not in free_tests
        and current_user.membership != "premium"
    ):

        return redirect(
            url_for("upgrade")
        )


    with open(f'data/{test_id}.json') as file:
        test = json.load(file)


    return render_template(
        'reading.html',
        test=test
    )


from flask import Flask, render_template, request
import json


# your other routes above...


@app.route("/result")
def result():

    score = int(request.args.get("score", 0))
    total = int(request.args.get("total", 0))

    band = calculate_band(score)

    return render_template(
        "result.html",
        score=score,
        total=total,
        band=band,
        answers=[]
    )


@app.route("/make-premium/<int:user_id>")
def make_premium(user_id):

    user = User.query.get(user_id)


    if user:

        user.membership = "premium"

        db.session.commit()

        return "User upgraded to Premium!"


    return "User not found"

@app.route("/upgrade")
@login_required
def upgrade():

    return render_template(
        "upgrade.html"
    )
with app.app_context():
    db.create_all()

from flask import request
import os

@app.route("/payment")
@login_required
def payment():

    return render_template(
        "payment.html"
    )

@app.route("/upload-payment", methods=["POST"])
@login_required
def upload_payment():

    file = request.files.get("payment_slip")

    if not file:
        return "No file uploaded"


    filename = (
        str(current_user.id)
        + "_"
        + file.filename
    )


    file.save(
        os.path.join(
            app.config["UPLOAD_FOLDER"],
            filename
        )
    )


    payment = Payment(
        user_id=current_user.id,
        slip=filename,
        status="pending"
    )


    db.session.add(payment)
    db.session.commit()


    return "Payment submitted. Please wait for approval."


@app.route("/approve-payment/<int:id>")
@login_required
def approve_payment(id):

    if not current_user.is_admin:
        return "Access denied"


    payment = Payment.query.get(id)


    if not payment:
        return "Payment not found"


    user = User.query.get(
        payment.user_id
    )


    if not user:
        return "User not found"



    # Upgrade user
    user.membership = "premium"


    # Update payment status
    payment.status = "approved"



    db.session.commit()



    return "Payment approved successfully!"

if __name__ == "__main__":
    app.run(debug=True)





