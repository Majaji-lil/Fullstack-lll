# Step 1: Build the frontend application
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies first (for better caching)
COPY package*.json ./
RUN npm install --include=dev --legacy-peer-deps

# Copy the rest of your application code
COPY . .

# Run the build (Vite will now be found perfectly)
RUN npm run build

# Step 2: Set up the production Nginx server
FROM nginx:alpine

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy your custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]