Job Application Tracker
A simple MERN stack application to help you track your job applications, their statuses, and view a timeline of status changes.

Table of Contents
Features

Technologies Used

Prerequisites

Getting Started

Backend Setup

Frontend Setup

Usage

API Endpoints

Authentication

Contributing

License

Features
Add Job Applications: Easily add new job applications with details like company, role, and initial status.

Track Status: Update the status of your applications (Applied, Interview, Offer, Rejected).

Timeline View: Visualize the history of status changes for each job application.

Filter Applications: Filter your job list by application status.

Optional Resume Upload: Attach a resume file to each application.

User Authentication: Secure your data with user registration and login (JWT-based).

Technologies Used
This project is built using the MERN stack:

MongoDB: A NoSQL database for storing job application data and user information.

Express.js: A Node.js web application framework for building the backend API.

React: A JavaScript library for building the user interface.

Node.js: A JavaScript runtime environment for the backend.

Other Key Technologies:

Mongoose: ODM (Object Data Modeling) library for MongoDB and Node.js.

Cors: Node.js package for providing a Connect/Express middleware that can be used to enable CORS.

Multer: Node.js middleware for handling multipart/form-data, primarily used for file uploads.

JSON Web Tokens (JWT): For secure user authentication.

Bcrypt.js: For hashing passwords.

Tailwind CSS: A utility-first CSS framework for styling the frontend.

Prerequisites
Before you begin, ensure you have the following installed on your machine:

Node.js (LTS version recommended)

npm (comes with Node.js) or Yarn

MongoDB (Community Edition or access to a MongoDB Atlas cluster)

Getting Started
Follow these steps to get the project up and running on your local machine.

Backend Setup
Clone the repository (if applicable) or create a new directory:

mkdir job-tracker-mern
cd job-tracker-mern
mkdir backend
cd backend

Initialize a new Node.js project and install dependencies:

npm init -y
npm install express mongoose cors multer dotenv jsonwebtoken bcryptjs

Create server.js:
Create a file named server.js in the backend directory and paste the backend code provided previously.

Create .env file:
Create a file named .env in the backend directory and add your MongoDB connection URI and a JWT secret key:

MONGO_URI=mongodb://localhost:27017/jobtrackerdb
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

Replace mongodb://localhost:27017/jobtrackerdb with your MongoDB connection string. If you're using MongoDB Atlas, get your connection string from there.

Replace your_super_secret_jwt_key_here_change_this_in_production with a strong, random string.

Start the backend server:

node server.js

The server should start on http://localhost:5000 (or your specified port).

Frontend Setup
Navigate back to the root of your project and create the frontend directory:

cd ..
npx create-react-app frontend
cd frontend

Install Tailwind CSS (if not already set up with create-react-app):
Follow the official Tailwind CSS installation guide for Create React App:

npm install -D tailwindcss
npx tailwindcss init

Configure your tailwind.config.js to scan your React files:

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

Add Tailwind directives to your src/index.css or src/App.css:

/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Optional: Add Inter font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

Replace src/App.js:
Replace the content of src/App.js with the React frontend code provided previously. Ensure the API_BASE_URL in App.js matches your backend server's address (e.g., http://localhost:5000/api).

Start the frontend development server:

npm start

This will open the application in your browser, usually at http://localhost:3000.

Usage
Register/Login: (Conceptual - you'd build a login/register form on the frontend)

Use the /api/register endpoint to create a new user.

Use the /api/login endpoint to log in and receive a JWT.

In the current frontend, a userId is hardcoded for demonstration. In a real application, this would come from the authenticated user's token.

Add a Job:

Fill out the "Company" and "Role" fields.

Select the initial "Status".

Optionally, upload a resume file.

Click "Add Job".

View and Filter Jobs:

All your added jobs will appear in the list below the form.

Use the filter buttons ("All", "Applied", "Interview", "Offer", "Rejected") to narrow down the list.

Edit a Job:

Click the "Edit" (pencil icon) button next to a job.

The form will pre-populate with the job's details.

Make your changes and click "Update Job".

View Timeline:

Click the "Timeline" (calendar icon) button next to a job.

A modal will appear showing the historical status changes for that application.

Delete a Job:

Click the "Delete" (trash can icon) button next to a job.

The job and its associated resume (if any) will be removed.

API Endpoints
The backend provides the following RESTful API endpoints:

Method

Endpoint

Description

Authentication

POST

/api/register

Register a new user

None

POST

/api/login

Log in a user and get a JWT

None

GET

/api/jobs?userId=

Get all job applications for a specific user

Required

POST

/api/jobs

Add a new job application

Required

PUT

/api/jobs/:id

Update an existing job application

Required

DELETE

/api/jobs/:id

Delete a job application

Required

Note: The authenticateToken middleware is commented out in the provided backend code for easier initial testing. For a production environment, uncomment it to secure your routes.

Authentication
The backend implements JWT-based authentication.

Upon successful login (/api/login), the server returns a JWT.

This token should be stored on the client-side (e.g., in localStorage).

For protected routes, the client must send this token in the Authorization header as a Bearer token (e.g., Authorization: Bearer <your_jwt_token>).

The backend's authenticateToken middleware verifies the token and attaches the user's information to the request.

Contributing
Feel free to fork this repository and contribute!

Fork the repository.

Create your feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

License
Distributed under the MIT License. See LICENSE for more information.
