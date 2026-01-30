-- Database initialization script for eCommerce SaaS
-- Run this script to create the initial database structure

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ecommerce_dev;
CREATE DATABASE IF NOT EXISTS ecommerce_test;

-- Create user with privileges (PostgreSQL)
-- Note: Run this with superuser privileges

-- Connect to ecommerce_dev
\c ecommerce_dev;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Initial tables will be created by Prisma migrations
-- This script is here for reference and manual setup if needed

GRANT ALL PRIVILEGES ON DATABASE ecommerce_dev TO postgres;
GRANT ALL PRIVILEGES ON DATABASE ecommerce_test TO postgres;

-- Create test user (optional)
CREATE USER ecommerce_user WITH PASSWORD 'ecommerce_password' ENCRYPTED;
GRANT ALL PRIVILEGES ON DATABASE ecommerce_dev TO ecommerce_user;
GRANT ALL PRIVILEGES ON DATABASE ecommerce_test TO ecommerce_user;

-- All tables and schemas will be handled by Prisma
-- Run: npx prisma migrate dev

COMMIT;
