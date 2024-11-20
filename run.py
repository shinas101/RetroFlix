from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import humanize
import re
import os
from dotenv import load_dotenv
import requests
from os import getenv

# Load environment variables
load_dotenv()
app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5500", "http://127.0.0.1:5500"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# MongoDB Configuration
client = MongoClient("mongodb+srv://notpointbreak:Password246M@cluster0.gzxc2sc.mongodb.net/?retryWrites=true&w=majority")
db = client.get_database('bifrost')
links = db.gdtot

# Add TMDB API key from environment
TMDB_API_KEY = getenv('TMDB_API_KEY')

# API Routes
@app.route('/api/search', methods=['GET'])
def search_content():
    try:
        # Get search query
        query = request.args.get("q")
        if not query:
            return jsonify({
                "status": "error",
                "message": "Search query is required",
                "results": []
            }), 400

        # Perform search
        result = links.aggregate([
            {
                "$search": {
                    "index": "default",
                    "text": {
                        "query": query,
                        "path": "indexTitle",
                        "fuzzy": {},
                    }
                }
            },
            {
                "$project": {
                    "title": 1,
                    "link": 1,
                    "size": 1,
                    "imdbId": 1,
                    "score": {'$meta': 'searchScore'}
                }
            }
        ])

        # Process results
        search_results = []
        for item in list(result):
            if item['score'] > 3:
                data = {
                    "title": item['title'],
                    "imdbId": item.get('imdbId', 'N/A'),
                    "size": humanize.naturalsize(int(item['size'])) if 'filepress' in item['link'] else item['size']
                }

                # Process link based on type
                if 'filepress' in item['link']:
                    data["link"] = re.sub(r'https:\/\/[a-zA-Z1-90.]+\/file\/',
                                        'https://new11.filepress.store/file/',
                                        item['link'])
                    data['linktype'] = 'filepress'
                elif 'gdflix' in item['link']:
                    data["link"] = re.sub(r'https:\/\/[a-zA-Z1-90.]+\/file\/',
                                        'https://new1.gdflix.cfd/file/',
                                        item['link'])
                    data['linktype'] = 'gdflix'
                elif 'gdtot' in item['link']:
                    data["link"] = item['link'].replace('new6.gdtot.cfd', 'new2.gdtot.dad')
                    data['linktype'] = 'gdtot'
                elif 'appdrive' in item['link']:
                    data["link"] = item['link'].replace('.pro', '.lol')
                    data['linktype'] = 'appdrive'
                elif 'gofile' in item['link']:
                    data["link"] = re.sub(r'https:\/\/[a-zA-Z1-90.]+\/d\/',
                                        'https://gofile.io/d/',
                                        item['link'])
                    data['linktype'] = 'gofile'

                search_results.append(data)

        # Sort results by title
        search_results.sort(key=lambda x: x['title'])

        # Add CORS headers to the response
        response = jsonify({
            "status": "success",
            "message": f"Found {len(search_results)} results",
            "results": search_results
        })
        
        return response

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "results": []
        }), 500

@app.route('/api/imdb', methods=['GET'])
def search_by_imdb():
    try:
        # Get IMDB ID
        imdb_id = request.args.get("id")
        if not imdb_id:
            return jsonify({
                "status": "error",
                "message": "IMDB ID is required",
                "results": []
            }), 400

        # Perform search
        result = links.aggregate([
            {
                "$search": {
                    "index": "imdbsearch",
                    "text": {
                        "query": imdb_id,
                        "path": "imdbId",
                        "fuzzy": {},
                    }
                }
            },
            {
                "$project": {
                    "title": 1,
                    "link": 1,
                    "size": 1,
                    "imdbId": 1,
                    "score": {'$meta': 'searchScore'}
                }
            }
        ])

        # Process results
        search_results = []
        for item in list(result):
            if item['score'] > 3:
                data = {
                    "title": item['title'],
                    "imdbId": item.get('imdbId', 'N/A'),
                    "size": humanize.naturalsize(int(item['size'])) if 'filepress' in item['link'] else item['size']
                }

                # Process link based on type
                if 'filepress' in item['link']:
                    data["link"] = re.sub(r'https:\/\/[a-zA-Z1-90.]+\/file\/',
                                        'https://new8.filepress.store/file/',
                                        item['link'])
                    data['linktype'] = 'filepress'
                elif 'gdflix' in item['link']:
                    data["link"] = re.sub(r'https:\/\/[a-zA-Z1-90.]+\/file\/',
                                        'https://new.gdflix.ink/file/',
                                        item['link'])
                    data['linktype'] = 'gdflix'
                elif 'gdtot' in item['link']:
                    data["link"] = item['link'].replace('new6.gdtot.cfd', 'new.gdtot.dad')
                    data['linktype'] = 'gdtot'
                elif 'appdrive' in item['link']:
                    data["link"] = item['link'].replace('.pro', '.lol')
                    data['linktype'] = 'appdrive'
                elif 'gofile' in item['link']:
                    data["link"] = re.sub(r'https:\/\/[a-zA-Z1-90.]+\/d\/',
                                        'https://gofile.io/d/',
                                        item['link'])
                    data['linktype'] = 'gofile'

                search_results.append(data)

        return jsonify({
            "status": "success",
            "message": f"Found {len(search_results)} results",
            "results": search_results
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "results": []
        }), 500

@app.route('/api/trending/movies', methods=['GET'])
def get_trending_movies():
    try:
        response = requests.get(
            f'https://api.themoviedb.org/3/trending/movie/week?api_key={TMDB_API_KEY}'
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/tv/popular', methods=['GET'])
def get_popular_tv():
    try:
        response = requests.get(
            f'https://api.themoviedb.org/3/tv/popular?api_key={TMDB_API_KEY}'
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/search/multi', methods=['GET'])
def search_multi():
    query = request.args.get('query')
    try:
        response = requests.get(
            f'https://api.themoviedb.org/3/search/multi?api_key={TMDB_API_KEY}&query={query}'
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/details/<type>/<id>', methods=['GET'])
def get_details(type, id):
    try:
        # Get main details
        details = requests.get(
            f'https://api.themoviedb.org/3/{type}/{id}?api_key={TMDB_API_KEY}'
        ).json()
        
        # Get credits
        credits = requests.get(
            f'https://api.themoviedb.org/3/{type}/{id}/credits?api_key={TMDB_API_KEY}'
        ).json()
        
        # Get similar
        similar = requests.get(
            f'https://api.themoviedb.org/3/{type}/{id}/similar?api_key={TMDB_API_KEY}'
        ).json()
        
        return jsonify({
            "details": details,
            "credits": credits,
            "similar": similar
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Error Handlers
@app.errorhandler(404)
def not_found(e):
    return jsonify({
        "status": "error",
        "message": "Resource not found",
        "results": []
    }), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({
        "status": "error",
        "message": "Internal server error",
        "results": []
    }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
