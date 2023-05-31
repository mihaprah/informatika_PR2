# Use Node.js as the base image
FROM node:17-alpine

# Install xdg-utils for opening the browser
RUN apk add --no-cache xdg-utils

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project directory to the working directory
COPY . .

# Expose the port that the development server will be listening on
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]
