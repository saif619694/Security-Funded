from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from security_funded import get_data
from pymongo import MongoClient, ASCENDING, DESCENDING
import os
from datetime import datetime

# Get the absolute path to the directory where main.py is located
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FRONTEND_BUILD_DIR = os.path.join(BASE_DIR, 'static', 'frontend')

app = Flask(__name__, static_folder=FRONTEND_BUILD_DIR)
CORS(app)  # Enable CORS for all routes

# MongoDB connection
def get_db_connection():
    db_username = os.getenv("DB_USERNAME")
    db_password = os.getenv("DB_PASSWORD")
    client = MongoClient(f'mongodb+srv://{db_username}:{db_password}@securityfun.v19tawj.mongodb.net/')
    db = client['security_funded']
    return db, client

# API endpoint to fetch paginated data
@app.route('/api/funding-data', methods=['GET'])
def get_funding_data():
    try:
        # Get query parameters
        page = int(request.args.get('page', 1))
        items_per_page = int(request.args.get('itemsPerPage', 10))
        sort_field = request.args.get('sortField', 'date')
        sort_direction = request.args.get('sortDirection', 'desc')
        search_term = request.args.get('search', '')
        filter_round = request.args.get('filterRound', '')
        
        # Connect to MongoDB
        db, client = get_db_connection()
        collection = db['SecurityFunded']
        
        # Build query
        query = {}
        if search_term:
            query['$or'] = [
                {'company_name': {'$regex': search_term, '$options': 'i'}},
                {'description': {'$regex': search_term, '$options': 'i'}},
                {'company_type': {'$regex': search_term, '$options': 'i'}}
            ]
        
        if filter_round:
            query['round'] = filter_round
        
        # Map frontend sort fields to MongoDB fields
        sort_field_map = {
            'company_name': 'company_name',
            'amount': 'amount',
            'date': 'date'
        }
        
        mongo_sort_field = sort_field_map.get(sort_field, 'date')
        sort_order = DESCENDING if sort_direction == 'desc' else ASCENDING
        
        # Get total count for pagination
        total_count = collection.count_documents(query)
        
        # Calculate skip value
        skip = (page - 1) * items_per_page
        
        # Fetch data with pagination and sorting
        cursor = collection.find(query).sort(mongo_sort_field, sort_order).skip(skip).limit(items_per_page)
        
        # Convert cursor to list and format data
        data = []
        for idx, doc in enumerate(cursor):
            # Convert MongoDB document to frontend format
            formatted_doc = {
                'id': str(doc.get('_id')),
                'description': doc.get('description', ''),
                'company_name': doc.get('company_name', ''),
                'company_url': doc.get('company_url', ''),
                'amount': doc.get('amount', 0),
                'round': doc.get('round', ''),
                'investors': [inv.get('name', '') if isinstance(inv, dict) else inv for inv in doc.get('investors', [])],
                'story_link': doc.get('story_link', ''),
                'source': doc.get('Source', doc.get('source', '')),
                'date': doc.get('date', ''),
                'company_type': doc.get('company_type', ''),
                'reference': doc.get('reference', '')
            }
            data.append(formatted_doc)
        
        # Calculate total pages
        total_pages = (total_count + items_per_page - 1) // items_per_page
        
        client.close()
        
        return jsonify({
            'data': data,
            'totalCount': total_count,
            'totalPages': total_pages,
            'currentPage': page,
            'itemsPerPage': items_per_page
        }), 200
        
    except Exception as e:
        print(f"Error fetching funding data: {str(e)}")
        return jsonify({'error': str(e)}), 500

# API endpoint to get unique funding rounds for filter
@app.route('/api/funding-rounds', methods=['GET'])
def get_funding_rounds():
    try:
        db, client = get_db_connection()
        collection = db['SecurityFunded']
        
        # Get distinct funding rounds
        rounds = collection.distinct('round')
        rounds = [r for r in rounds if r]  # Filter out empty values
        rounds.sort()
        
        client.close()
        
        return jsonify({'rounds': rounds}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# API endpoint to trigger data collection
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