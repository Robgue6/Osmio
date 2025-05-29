FROM node:20-slim

# Install necessary packages for Ubuntu
RUN apt-get update && apt-get install -y \
    curl \
    bash \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install Wasp
RUN curl -sSL https://get.wasp.sh/installer.sh | sh
ENV PATH="/root/.local/bin:$PATH"

# Verify Wasp installation
RUN wasp version

# Set working directory
WORKDIR /app

# Copy source code
COPY . .

# Build the Wasp app
RUN wasp build

# Verify build structure
RUN ls -la .wasp/build/

# Set working directory to built server
WORKDIR /app/.wasp/build/server

# Verify server directory contents
RUN ls -la && cat package.json

# Install server dependencies
RUN npm install

# Create the bundle during build time
RUN npm run bundle

# Verify bundle was created
RUN ls -la bundle/

# Expose port
EXPOSE 8080

# Start the server using the bundle-and-start script
CMD ["npm", "run", "bundle-and-start"] 