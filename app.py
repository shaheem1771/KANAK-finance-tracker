from flask import Flask, render_template, jsonify, request
import csv
import os
from functools import lru_cache
from decimal import Decimal, InvalidOperation
from typing import List, Dict
import threading
import tempfile
import logging

logging.basicConfig(level=logging.INFO)

# simple lock for safe CSV writes in this single-process app
_write_lock = threading.Lock()


def create_app(config=None):
    app = Flask(__name__, static_folder='static')
    if config:
        app.config.update(config)

    @app.route('/')
    def index():
        expenses = load_expenses(app.config.get('EXPENSES_CSV', 'expenses.csv'))
        total = sum(e['amount'] for e in expenses)
        return render_template('index.html', expenses=expenses, total=total)

    @app.route('/api/expenses', methods=['GET', 'POST'])
    def api_expenses():
        csv_path = app.config.get('EXPENSES_CSV', 'expenses.csv')
        if request.method == 'GET':
            return jsonify(load_expenses(csv_path))

        # POST: add a new expense (expects JSON)
        data = request.get_json() or {}
        date = (data.get('date') or '').strip()
        category = (data.get('category') or '').strip()
        note = (data.get('note') or '').strip()
        amount_raw = data.get('amount')
        try:
            amount = float(Decimal(str(amount_raw)))
        except Exception:
            return jsonify({'error': 'invalid amount'}), 400

        row = {'date': date, 'category': category, 'amount': f"{amount:.2f}", 'note': note}
        try:
            append_expense(csv_path, row)
        except Exception as e:
            logging.exception('Failed to append expense')
            return jsonify({'error': 'failed to save'}), 500

        # clear cache so subsequent reads include this
        try:
            load_expenses.cache_clear()
        except Exception:
            pass

        return jsonify(row), 201

    return app


@lru_cache(maxsize=1)
def load_expenses(path: str = 'expenses.csv') -> List[Dict]:
    """Load expenses from CSV and normalize rows.

    Returns a list of dicts with keys: date, category, amount (float), note.
    Cached for fast repeated reads.
    """
    rows: List[Dict] = []
    if not os.path.exists(path):
        return rows

    with open(path, newline='') as f:
        reader = csv.DictReader(f)
        for r in reader:
            amt = r.get('amount', '')
            try:
                amount = float(Decimal(str(amt)).quantize(Decimal('0.01')))
            except Exception:
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


def append_expense(path: str, row: Dict[str, str]) -> None:
    """Append a row to CSV safely using a lock.

    Row should contain keys: date, category, amount, note (all strings).
    """
    with _write_lock:
        dirpath = os.path.dirname(path) or '.'
        os.makedirs(dirpath, exist_ok=True)
        file_exists = os.path.exists(path)
        # open in append mode; write header if missing
        with open(path, 'a', newline='') as wf:
            writer = csv.DictWriter(wf, fieldnames=['date', 'category', 'amount', 'note'])
            if not file_exists:
                writer.writeheader()
            writer.writerow(row)
