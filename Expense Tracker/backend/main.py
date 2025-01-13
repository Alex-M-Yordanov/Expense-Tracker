from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import time

app = Flask(__name__) #initializing the app
#CORS(app, origins=["http://localhost:3000"]) # communication between client and server
CORS(app, resources={r"/*": {"origins": "*"}})
# MySQL connection
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/Expenses_db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@db:3306/Expenses_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False #disables unnescessary event tracking for performanc eoptimmization
db = SQLAlchemy(app)

## Classes

# Class representing the expense categories
class ExpenseGroup(db.Model):
    __tablename__ = 'ExpenseGroups'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)

    entries = db.relationship('ExpenseEntry', backref='group', cascade="all, delete-orphan", lazy=True)

# Class representing the expense entries
class ExpenseEntry(db.Model):
    __tablename__ = 'ExpenseEntries'
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('ExpenseGroups.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text, nullable=True)

## Helpers

# Helper for handling errors with consistent JSON response
def handle_error(message, status_code=500):
    return jsonify({"error": message}), status_code

# Helper validating that all required keys are in the provided data
def validate_request_data(required_keys, data):
    if not all(key in data for key in required_keys):
        return handle_error(f"Missing required fields: {', '.join(required_keys)}", 400)
    return None

# Helper that parses a date string into a datetime object.
def parse_date(date_str, format="%Y-%m-%d"):
    try:
        return datetime.strptime(date_str, format)
    except ValueError:
        return None
# Helper for calculating totals based on filter conditions.
def calculate_total(filter_conditions):
    return db.session.query(db.func.sum(ExpenseEntry.amount)).filter(*filter_conditions).scalar() or 0.0

## Routes

# Creating an expense category
@app.route('/groups', methods=['POST'])
def create_group():
    data = request.json
    error = validate_request_data(['name'], data)
    if error:
        return error

    group = ExpenseGroup(name=data['name'])
    try:
        db.session.add(group)
        db.session.commit()
        return jsonify({"id": group.id, "name": group.name}), 201
    except Exception as e:
        db.session.rollback()
        return handle_error(f"Failed to create group: {e}")

# Retrieving category names and IDs
@app.route('/groups', methods=['GET'])
def get_groups():
    groups = ExpenseGroup.query.all()
    return jsonify([{"id": group.id, "name": group.name} for group in groups])

# Deleting an expense category
@app.route('/groups/<int:group_id>', methods=['DELETE'])
def delete_group(group_id):
    group = ExpenseGroup.query.get(group_id)
    if not group:
        return handle_error("Group not found", 404)
    try:
        db.session.delete(group)
        db.session.commit()
        return jsonify({"message": "Group and associated expenses deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return handle_error(f"Failed to delete group: {e}")

# Retrieves all expenses for a specific group
@app.route('/expenses/group/<int:group_id>', methods=['GET'])
def get_expenses_by_group(group_id):
    group = ExpenseGroup.query.get(group_id)
    if not group:
        return handle_error("Group not found", 404)

    expenses = ExpenseEntry.query.filter_by(group_id=group_id).all()
    return jsonify([
        {
            "id": expense.id,
            "group_id": expense.group_id,
            "amount": expense.amount,
            "date": expense.date.strftime("%Y-%m-%d"),
            "description": expense.description
        }
        for expense in expenses
    ])

# Adding an expense to a certain category
@app.route('/expenses', methods=['POST'])
def add_expense():
    data = request.json
    error = validate_request_data(['group_id', 'amount', 'date'], data)
    if error:
        return error

    expense = ExpenseEntry(
        group_id=data['group_id'],
        amount=data['amount'],
        date=parse_date(data['date']),
        description=data.get('description')
    )
    try:
        db.session.add(expense)
        db.session.commit()
        return jsonify({"id": expense.id}), 201
    except Exception as e:
        db.session.rollback()
        return handle_error(f"Failed to add expense: {e}")
    
# Deleting an expense by ID
@app.route('/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    expense = ExpenseEntry.query.get(expense_id)
    if not expense:
        return handle_error("Expense not found", 404)
    try:
        db.session.delete(expense)
        db.session.commit()
        return jsonify({"message": "Expense deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return handle_error(f"Failed to delete expense: {e}")

# Calculation the total spent amount for a certain month
@app.route('/expenses/total', methods=['GET'])
def get_total_by_month_and_year():
    month, year = request.args.get('month'), request.args.get('year')
    if not (month and year):
        return handle_error("Month and year are required", 400)

    try:
        month, year = int(month), int(year)
        total = calculate_total([
            db.extract('month', ExpenseEntry.date) == month,
            db.extract('year', ExpenseEntry.date) == year
        ])
        return jsonify({"month": month, "year": year, "total_spent": total})
    except Exception as e:
        return handle_error(f"Failed to calculate total: {e}")

# Calculating the total spent amount in a period of time (months)
@app.route('/expenses/total_range', methods=['GET'])
def get_total_by_date_range():
    start_date, end_date = request.args.get('start_date'), request.args.get('end_date')
    if not (start_date and end_date):
        return handle_error("Start date and end date are required", 400)

    start_date_obj, end_date_obj = parse_date(start_date), parse_date(end_date)
    if not (start_date_obj and end_date_obj):
        return handle_error("Invalid date format. Use YYYY-MM-DD.", 400)

    total = calculate_total([
        ExpenseEntry.date >= start_date_obj,
        ExpenseEntry.date <= end_date_obj
    ])
    return jsonify({"start_date": start_date, "end_date": end_date, "total_spent": total})

# Calculating the total spent amount in a certain year
@app.route('/expenses/total_year', methods=['GET'])
def get_total_by_year():
    year = request.args.get('year')
    if not year:
        return handle_error("Year is required", 400)

    try:
        year = int(year)
        total = calculate_total([db.extract('year', ExpenseEntry.date) == year])
        return jsonify({"year": year, "total_spent": total})
    except Exception as e:
        return handle_error(f"Failed to calculate total for the year: {e}")

# Calculating the total spent amount in a certain year for a certain category
@app.route('/expenses/total_year_group', methods=['GET'])
def get_total_by_year_group():
    year, group_id = request.args.get('year'), request.args.get('group_id')
    if not (year and group_id):
        return handle_error("Year and Group ID are required", 400)

    try:
        year, group_id = int(year), int(group_id)
        total = calculate_total([
            db.extract('year', ExpenseEntry.date) == year,
            ExpenseEntry.group_id == group_id
        ])
        return jsonify({"year": year, "group_id": group_id, "total_spent": total})
    except Exception as e:
        return handle_error(f"Failed to calculate total for the year and group: {e}")

# Calculating the total spent amount for a certain category in a certain month
@app.route('/expenses/total_month_year_group', methods=['GET'])
def get_total_by_month_year_group():
    month, year, group_id = request.args.get('month'), request.args.get('year'), request.args.get('group_id')
    if not (month and year and group_id):
        return handle_error("Month, Year, and Group ID are required", 400)

    try:
        month, year, group_id = int(month), int(year), int(group_id)
        total = calculate_total([
            db.extract('year', ExpenseEntry.date) == year,
            db.extract('month', ExpenseEntry.date) == month,
            ExpenseEntry.group_id == group_id
        ])
        return jsonify({"month": month, "year": year, "group_id": group_id, "total_spent": total})
    except Exception as e:
        return handle_error(f"Failed to calculate total for the month, year, and group: {e}")

# Calculating the average amount spent in a period of months for a certain category
@app.route('/expenses/average_monthly', methods=['GET'])
def get_average_monthly_spent():
    group_id, start_date, end_date = request.args.get('group_id'), request.args.get('start_date'), request.args.get('end_date')
    if not (group_id and start_date and end_date):
        return handle_error("Group ID, start date, and end date are required", 400)

    try:
        group_id = int(group_id)
        start_date_obj, end_date_obj = parse_date(start_date, "%Y-%m"), parse_date(end_date, "%Y-%m")
        if not (start_date_obj and end_date_obj) or start_date_obj > end_date_obj:
            return handle_error("Invalid date range. Use YYYY-MM format.", 400)

        total_months = (end_date_obj.year - start_date_obj.year) * 12 + (end_date_obj.month - start_date_obj.month) + 1
        total_spent = calculate_total([
            ExpenseEntry.group_id == group_id,
            ExpenseEntry.date >= start_date_obj,
            ExpenseEntry.date <= end_date_obj
        ])
        average_spent = total_spent / total_months if total_months else 0.0

        return jsonify({"group_id": group_id, "start_date": start_date, "end_date": end_date,
                        "total_spent": total_spent, "average_monthly_spent": average_spent})
    except Exception as e:
        return handle_error(f"Failed to calculate average monthly spending: {e}")


# Initializing database
def initialize_database():
    with app.app_context():
        db.create_all()  # creates all tables in the schema if not already created
        #print("Database tables created!")

if __name__ == '__main__':
    initialize_database()
    app.run(host='0.0.0.0', port=5000, debug=True)
    
