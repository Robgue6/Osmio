FROM node:20-alpine

# Install necessary packages
RUN apk update && apk add --no-cache curl bash

# Install Wasp
RUN curl -sSL https://get.wasp.sh/installer.sh | sh
ENV PATH="/root/.local/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy source code
COPY . .

# Build the Wasp app
RUN wasp build

# Set working directory to built server
WORKDIR /app/.wasp/build/server

# Install server dependencies
RUN npm install

# Expose port
EXPOSE 8080

# Start the server
CMD ["npm", "start"] 