"""
BomFusion AI - Python FastAPI / Flask Main Backend Server
-----------------------------------------------------------
This server exposes all engineering & AI analytics endpoints directly in Python.
Can be executed standalone using:
  pip install flask flask-cors
  python main.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add scripts directory to module path
sys.path.append(os.path.join(os.path.dirname(__file__), 'scripts'))

try:
    from ebom_processor import process_ebom
    from line_balancer import calculate_line_balance
    from classifier_engine import classify_components
    from quality_spc_engine import analyze_quality_spc
except ImportError as e:
    print(f"Warning: Module import warning: {e}")

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "engine": "Python 3.10 FastAPI/Flask Industrial Intelligence Engine",
        "version": "1.0.0"
    })

@app.route('/api/python/process-ebom', methods=['POST'])
def handle_process_ebom():
    data = request.get_json() or {}
    components = data.get('components', [])
    result = process_ebom(components)
    return jsonify(result)

@app.route('/api/python/balance-line', methods=['POST'])
def handle_line_balancer():
    data = request.get_json() or {}
    operations = data.get('operations', [])
    takt_time = data.get('taktTime', 45.0)
    stations = data.get('stations', 5)
    result = calculate_line_balance(operations, takt_time, stations)
    return jsonify(result)

@app.route('/api/python/classify-ebom', methods=['POST'])
def handle_classifier():
    data = request.get_json() or {}
    components = data.get('components', [])
    result = classify_components(components)
    return jsonify(result)

@app.route('/api/python/quality-spc', methods=['POST'])
def handle_quality_spc():
    data = request.get_json() or {}
    checkpoints = data.get('checkpoints', [])
    result = analyze_quality_spc(checkpoints)
    return jsonify(result)

if __name__ == '__main__':
    print("🚀 Starting BomFusion AI - Python Flask Backend Server on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
