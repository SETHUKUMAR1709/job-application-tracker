# MERN Stack Job Tracker

This is a MERN stack project designed to help you effortlessly track your job applications. Create an account, manage your applications, and access them whenever you need.

### 🔗 Visit the Live Demo Here!
*(Replace with your deployed application link)*

---

## ✨ Features

- **Add Job Applications**: Easily input details like company, role, and initial status.
- **Track Status**: Update application statuses (Applied, Interview, Offer, Rejected).
- **Timeline View**: See a historical timeline of status changes for each application.
- **Filter Applications**: Quickly sort your list by application status.
- **Optional Resume Upload**: Attach your resume directly to each application.
- **User Authentication**: Secure access to your data with user accounts.

---

## 🚀 Technologies Used

- **MongoDB**: NoSQL database for flexible data storage.
- **Express.js**: Robust backend framework for API development.
- **React**: Dynamic frontend for an interactive user interface.
- **Node.js**: JavaScript runtime for server-side operations.
- **Mongoose**: MongoDB object data modeling for Node.js.
- **Multer**: Handles file uploads for resumes.
- **JWT**: Secure token-based authentication.
- **Tailwind CSS**: Utility-first CSS for responsive and modern UI.

---

## 🛠️ Set-up

To get started with the project, clone the repository and install dependencies for both the backend and frontend:

```bash
# Clone the repository
git clone https://github.com/SETHUKUMAR1709/job-application-tracker.git
cd job-application-tracker
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with the following content:

```env
MONGO_URI=mongodb://localhost:27017/jobtrackerdb
JWT_SECRET=your_secret_key
```

Then start the backend server:

```bash
node server.js
```

### Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

Your application should now be running:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request.

```bash
# Clone the repository
git clone https://github.com/SETHUKUMAR1709/job-application-tracker.git

# Create a new branch for your feature or bugfix
git checkout -b your-feature-branch

# Make your changes

# Stage and commit your changes
git add .
git commit -m "feat: Add your amazing feature"

# Push to your branch
git push origin your-feature-branch
```

Then open a Pull Request on GitHub.

---

## 📄 License

Distributed under the MIT License. See the [LICENSE](LICENSE) file for more information.
