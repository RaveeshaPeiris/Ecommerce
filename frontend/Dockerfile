# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port Vite's development server runs on
EXPOSE 5173

# Start the development server with host binding
CMD ["npm", "run", "dev", "--", "--host"]
