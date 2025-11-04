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

#Pass environment variable for backend URL during build
ARG MONGO_URL
ARG PORT
ARG JWT_SECRET
ARG FRONTEND_URL

ENV MONGO_URL=${MONGO_URL}
ENV PORT=${PORT}
ENV JWT_SECRET=${JWT_SECRET}
ENV FRONTEND_URL=${FRONTEND_URL}

# Expose backend port (adjust if not 8080)
EXPOSE 8080

# Start the backend
CMD ["npm","run", "start"]
