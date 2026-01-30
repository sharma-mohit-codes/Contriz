# Contriz

Live App: https://contriz.vercel.app

A minimal MERN web app to split group expenses and generate optimized settlement suggestions.

## Features

User authentication (JWT)

Create groups and add members

Add shared expenses (equal split)

View group balances

Smart settlement recommendations (minimum transactions)

Cloud-hosted database (MongoDB Atlas)

## Tech Stack

Backend: Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcryptjs
Frontend: React, React Router, Axios, Context API
Deployment: Vercel (Frontend), Render (Backend)

## Project Structure

backend/
- config/db.js
- middleware/auth.js
- models/
- routes/
- utils/settlement.js
- server.js

frontend/
- src/pages/
- src/components/
- src/context/
- src/services/

## Setup

### Backend:
cd backend
npm install


Create .env:
PORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_secret


Run:
npm run dev

### Frontend
cd frontend
npm install
npm start

## Settlement Logic

- Calculate net balance for each user
- Separate debtors and creditors
- Greedily match them to minimize transactions

Example:
A owes B 100, A owes C 100, B owes C 100
→ A pays C 200

## Why This Project

- Solves a real-world problem
- Clean MERN architecture
- Demonstrates backend logic and algorithms
- Includes authentication and secure API handling
- Fully deployed cloud application