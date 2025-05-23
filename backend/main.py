from flask import Flask, jsonify, send_from_directory
from security_funded import get_data
import os

# Get the absolute path to the directory where main.py is located
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FRONTEND_BUILD_DIR = os.path.join(BASE_DIR, 'static', 'frontend')

app = Flask(__name__, static_folder=FRONTEND_BUILD_DIR)

# API endpoint
@app.route('/api/get_data', methods=['GET'])
def api_get_data():
    try:
        get_data()
        return jsonify({"message": "Data collection complete."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Serve frontend static files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)