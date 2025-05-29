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

# Set working directory to built server
WORKDIR /app/.wasp/build/server

# Install server dependencies
RUN npm install

# Expose port
EXPOSE 8080

# Start the server
CMD ["npm", "start"] 