📘** EdTech Learning Task Manager**

A simple MERN-based task manager designed for an EdTech environment with Student and Teacher roles.
Supports authentication, task creation, and strict role-based access.

🚀 Tech Stack

- React

- Node.js + Express

- MongoDB Atlas (Mongoose)

- JWT + bcrypt

- express-validator

🔧 Setup Instructions
1. Backend
cd server
npm install


- Create .env file:

PORT=5000
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=supersecretkey
TOKEN_EXPIRES_IN=7d


- Run backend:

npm run dev

2. Frontend
* cd client
* npm install
* npm run dev


Frontend runs on:

http://localhost:3000

🔐 Role Functionality (Important)
Student

- Can create, view, update, delete only their own tasks

- Must select a teacher during signup

- Cannot see other students’ or teacher tasks

- Teacher

Can view:

- Their own tasks

- Tasks created by assigned students

- Can update/delete only their own tasks

📌 API Summary

- POST /auth/signup – Register as student or teacher

- POST /auth/login – Returns JWT

- GET /tasks – Role-based task access

- POST /tasks – Create task

- PUT /tasks/:id – Update only own tasks

- DELETE /tasks/:id – Delete only own tasks

All task routes require a valid JWT token.


🐞 Known Issues

- Basic UI styling

- No pagination

- No advanced filters (except basic date filtering)

- These do not affect core functionality.

💡 Suggestions for Improvement

- Add better UI styling (Tailwind / Material UI)

- Add pagination for teacher task list

- Add full task editing
Voice chat ende
