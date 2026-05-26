# Job Application Tracker

A full-stack web application for tracking job applications, managing application statuses, and organizing the job search process.

## Project Overview

Job Application Tracker is a full-stack CRUD application built with React, FastAPI, PostgreSQL, and JWT authentication.

Users can register, log in, add job applications, and view their saved applications. Each user's application data is protected so that users can only access their own records.

This project was built to practice full-stack development, REST API design, database integration, authentication, and deployment preparation.

## Features

- User registration and login
- JWT-based authentication
- Protected user-specific application data
- Add new job applications
- View saved job applications
- Track company name, position, status, and notes
- PostgreSQL database integration
- Persistent login after page refresh
- Basic dashboard statistics

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic
- JWT Authentication

### Database

- PostgreSQL

### Tools

- Git
- GitHub
- VS Code

## Database Schema

### Users Table

| Field | Type | Description |
|---|---|---|
| id | Integer | Primary key |
| email | String | User email |
| hashed_password | String | Hashed password |

### Applications Table

| Field | Type | Description |
|---|---|---|
| id | Integer | Primary key |
| company | String | Company name |
| position | String | Job title or position |
| status | String | Application status |
| notes | String | Optional notes |
| user_id | Integer | Owner of the application record |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /register | Register a new user |
| POST | /login | Log in and receive an access token |
| GET | /applications | Get the logged-in user's applications |
| POST | /applications | Add a new job application |

## Local Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPO_LINK
cd job-application-tracter