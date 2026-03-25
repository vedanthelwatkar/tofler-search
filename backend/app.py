from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

COMPANIES = [
    {"id": 1, "name": "Tofler Analytics Pvt Ltd"},
    {"id": 2, "name": "Infosys Limited"},
    {"id": 3, "name": "Tata Consultancy Services Ltd"},
    {"id": 4, "name": "Wipro Technologies Pvt Ltd"},
    {"id": 5, "name": "Reliance Industries Limited"},
    {"id": 6, "name": "HDFC Bank Ltd"},
    {"id": 7, "name": "Bharti Airtel Limited"},
    {"id": 8, "name": "HCL Technologies Ltd"},
    {"id": 9, "name": "Tech Mahindra Pvt Ltd"},
    {"id": 10, "name": "Zomato India Ltd"},
    {"id": 11, "name": "Paytm Financial Services Pvt Ltd"},
    {"id": 12, "name": "Flipkart Internet Pvt Ltd"},
]


@app.route("/api/search")
def search():
    query = request.args.get("q", "").strip()

    if not query:
        return jsonify([])

    results = [
        company
        for company in COMPANIES
        if query.lower() in company["name"].lower()
    ]

    return jsonify(results)


@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
