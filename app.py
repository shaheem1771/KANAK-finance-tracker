from flask import Flask, render_template, jsonify
import csv
import os
from functools import lru_cache
from decimal import Decimal, InvalidOperation


def create_app(config=None):
    app = Flask(__name__, static_folder='static')
    if config:
        app.config.update(config)

    @app.route('/')
    def index():
        expenses = load_expenses(app.config.get('EXPENSES_CSV', 'expenses.csv'))
        total = sum(e['amount'] for e in expenses)
        return render_template('index.html', expenses=expenses, total=total)

    @app.route('/api/expenses')
    def api_expenses():
        return jsonify(load_expenses(app.config.get('EXPENSES_CSV', 'expenses.csv')))

    return app


@lru_cache(maxsize=1)
def load_expenses(path='expenses.csv'):
    """Load expenses from CSV and normalize rows.

    Returns a list of dicts with keys: date, category, amount (float), note.
    """
    rows = []
    if not os.path.exists(path):
        return rows

    with open(path, newline='') as f:
        reader = csv.DictReader(f)
        for r in reader:
            amt = r.get('amount', '')
            try:
                amount = float(Decimal(amt.strip())) if amt is not None else 0.0
            except (InvalidOperation, AttributeError):
                amount = 0.0

            rows.append({
                'date': (r.get('date') or '').strip(),
                'category': (r.get('category') or '').strip(),
                'amount': amount,
                'note': (r.get('note') or '').strip(),
            })

    return rows


if __name__ == '__main__':
    # run with: python app.py
    app = create_app()
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=os.environ.get('FLASK_DEBUG', '1') == '1')
