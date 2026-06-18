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

To customize the CSV path, set the `EXPENSES_CSV` environment variable before running.

