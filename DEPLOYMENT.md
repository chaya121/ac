# Deployment Guide

## Overview

This application is now structured with clear separation of concerns:
- **Frontend**: React application (Vite)
- **Backend**: Express.js server
- **Database**: SQLite (local) or PostgreSQL (cloud)

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Server Configuration
PORT=3001
NODE_ENV=production

# Database Configuration
DATABASE_TYPE=sqlite  # or 'postgresql' for cloud database
DATABASE_URL=postgresql://user:password@host:port/database  # Only for PostgreSQL
```

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm run start
```

## Docker Deployment

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t apparel-creations .

# Run the container
docker run -p 3001:3001 \
  -e DATABASE_TYPE=sqlite \
  -v $(pwd)/database:/app/database \
  apparel-creations
```

### Using Docker Compose

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

## Cloud Database Setup

### Option 1: Supabase (Free Tier)

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Update your `.env` file:
   ```bash
   DATABASE_TYPE=postgresql
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres
   ```

### Option 2: Neon (Free Tier)

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string
4. Update your `.env` file:
   ```bash
   DATABASE_TYPE=postgresql
   DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST].neon.tech/neondb?sslmode=require
   ```

### Option 3: Railway (Free Tier)

1. Go to [railway.app](https://railway.app) and create an account
2. Create a new PostgreSQL database
3. Copy the connection string
4. Update your `.env` file with the connection string

## Cloud Platform Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `DATABASE_TYPE`: `postgresql` (recommended for cloud)
   - `DATABASE_URL`: Your cloud database connection string
4. Deploy

### Railway Deployment

1. Push your code to GitHub
2. Import project in [railway.app](https://railway.app)
3. Railway will auto-detect the Node.js application
4. Add environment variables:
   - `DATABASE_TYPE`: `postgresql`
   - `DATABASE_URL`: Your cloud database connection string
5. Deploy

### Render Deployment

1. Push your code to GitHub
2. Create a new Web Service in [render.com](https://render.com)
3. Connect your GitHub repository
4. Add environment variables:
   - `DATABASE_TYPE`: `postgresql`
   - `DATABASE_URL`: Your cloud database connection string
5. Deploy

## Database Migration

If you're moving from local SQLite to cloud PostgreSQL:

1. Export your SQLite data using the bulk export feature in the app
2. Set up your cloud database
3. Update `.env` to use PostgreSQL
4. Import your data using the bulk import feature

## Troubleshooting

### Docker Build Fails

- Ensure Docker is running
- Check that all files are in the correct directories
- Verify the Dockerfile syntax

### Database Connection Issues

- Verify your DATABASE_URL is correct
- Ensure your cloud database allows connections from your deployment IP
- Check that SSL is enabled if required by your cloud provider

### Build Errors on Cloud Platform

- Ensure all dependencies are in package.json
- Check that the build script works locally first
- Verify environment variables are set correctly in the cloud platform

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   (React/Vite)  │
└────────┬────────┘
         │ HTTP
         ↓
┌─────────────────┐
│   Backend       │
│   (Express)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Database      │
│  (SQLite/PG)    │
└─────────────────┘
```

## Security Notes

- Never commit `.env` files to version control
- Use strong passwords for cloud databases
- Enable SSL for cloud database connections
- Regularly update dependencies
- Use environment variables for all sensitive data
