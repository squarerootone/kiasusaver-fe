# Qwik Dev Container
FROM node:20-slim

RUN apt update && apt install -y git \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm 

# Install GitHub Copilot dependencies (git, curl, etc. are already in base image)
# No extra steps needed for Copilot extension support

# Create src directory for mini-apps
RUN mkdir -p /workspace/src

WORKDIR /workspace
