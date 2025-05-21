# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r ./requirements.txt
# Copy the current directory contents into the container at /app
COPY . /app

# Run the application
CMD ["python", "security_funded.py"]