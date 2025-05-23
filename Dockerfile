# Multi-stage Dockerfile for Frontend and Backend

# --- Frontend Build Stage ---
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy only necessary files for dependency installation first to leverage Docker cache
COPY frontend/package.json frontend/package-lock.json frontend/bun.lockb ./
RUN npm install

# Copy the rest of the frontend source code
COPY frontend/ .

# Build the frontend application
RUN npm run build

# --- Backend Stage ---
FROM python:3.12-slim

WORKDIR /app/backend

# Copy backend requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ .

# Copy built frontend assets from the frontend-builder stage
# Assuming Vite builds to a 'dist' directory inside the frontend project
COPY --from=frontend-builder /app/frontend/dist /app/backend/static/frontend

EXPOSE 8000

CMD ["gunicorn", "-w", "1", "main:app", "--bind", "0.0.0.0:8000"]