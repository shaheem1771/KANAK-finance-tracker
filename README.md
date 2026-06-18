# Personal Finance Tracker

This repository is a minimal, efficient personal finance tracker web app.

Quick start

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Features:
- Lightweight Flask app with an `/api/expenses` JSON endpoint
- Simple CSV-backed data (`expenses.csv`)
- Small, responsive UI in `templates/index.html`

Interactive usage:
- The web UI includes an "Add Expense" form to append new rows to `expenses.csv`.
- The API endpoint `POST /api/expenses` accepts JSON `{date,category,amount,note}` and returns the saved row.

Notes:
- This app uses a simple CSV backend and is intended for small personal datasets. For production use, migrate to a proper database.

To customize the CSV path, set the `EXPENSES_CSV` environment variable before running.

