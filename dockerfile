# Stage 1: Build the React app using Vite
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code and build
COPY . .
RUN npm run build

# Stage 2: Run the production build using Vite's preview
FROM node:18-alpine
WORKDIR /app

# Copy the built app from the builder stage
COPY --from=builder /app .

# Ensure Vite's preview server listens on all interfaces
ENV HOST=0.0.0.0

# Expose the default Vite preview port (4173)
EXPOSE 4173

# Start the preview server with the --host flag
CMD ["npm", "run", "preview", "--", "--host"]
