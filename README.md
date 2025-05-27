# TaskFlow

This project is a task management application with a Node.js/Express backend and a React frontend.

## Prerequisites
- Node.js (v18 or higher recommended)
- npm
- MySQL (XAMPP)

## Installation

1. **Clone the repository:**

   git clone https://github.com/AleGomoj/ProjectTaskManagement
   cd ProjectTaskManagement

2. **Install dependencies:**
   cd backend
   npm install
   cd ../frontend
   npm install
   cd ..

3. **Configure the database:**
   - Open XAMPP
   - Use ScriptSQL.txt to copy database estructure on phpMyAdmin
   - Ask AleGomoj for .env :)


## Running the project

On Windows, you can start both backend and frontend automatically by running the script:

./start-apps.bat

This will open two terminals: one for the backend and one for the frontend.

- The backend will be available at `http://localhost:4000`
- The frontend will be available at `http://localhost:3000`

If you prefer to start manually:

1. **Backend:**
   cd backend
   node app.js

2. **Frontend:**

   cd frontend
   npm start

## Notes
- Make sure your database server is running before starting the backend.
- If you use Linux/MacOS, you can use the `start-apps.sh` script.

---

You're all set! You can now start using ProjectTaskManagement.
