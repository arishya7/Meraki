#!/bin/bash
# Script to start the backend server

# Activate virtual environment if it exists
if [ -d "../venv" ]; then
    source ../venv/bin/activate
elif [ -d "venv" ]; then
    source venv/bin/activate
fi

# Install/update dependencies
pip install -r requirements.txt

# Run the server from the project root
cd ..
uvicorn Backend.main:app --reload --host 0.0.0.0 --port 8000

