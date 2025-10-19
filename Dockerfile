# Backend Dockerfile

# Use official Node.js 20 image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Expose backend port (adjust if not 8080)
EXPOSE 8080

# Start the backend
CMD ["npm","run", "start"]
