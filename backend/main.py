from flask import Flask, jsonify
from security_funded import get_data

app = Flask(__name__)

@app.route('/api/get_data', methods=['GET'])
def api_get_data():
    try:
        get_data()
        return jsonify({"message": "Data collection complete."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)