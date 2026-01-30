# Contriz

**Live App:** https://contriz.vercel.app

[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

A minimal MERN web app to split group expenses and generate optimized settlement suggestions.

---

## Features

- User authentication (JWT)
- Create groups and add members
- Add shared expenses (equal split)
- View group balances
- Smart settlement recommendations (minimum transactions)
- Cloud-hosted database (MongoDB Atlas)

## Tech Stack

**Backend:** Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcryptjs  
**Frontend:** React, React Router, Axios, Context API  
**Deployment:** Vercel (Frontend), Render (Backend)

## Project Structure

```
backend/
├── config/db.js
├── middleware/auth.js
├── models/
├── routes/
├── utils/settlement.js
└── server.js

frontend/
└── src/
    ├── pages/
    ├── components/
    ├── context/
    └── services/
```

## Setup

### Backend

```bash
cd backend
npm install
```

Create `.env`:
```env
PORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_secret
```

Run:
```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Settlement Logic

- Calculate net balance for each user
- Separate debtors and creditors
- Greedily match them to minimize transactions

**Example:**  
A owes B 100, A owes C 100, B owes C 100  
→ A pays C 200

## Why This Project

- Solves a real-world problem
- Clean MERN architecture
- Demonstrates backend logic and algorithms
- Includes authentication and secure API handling
- Fully deployed cloud application
