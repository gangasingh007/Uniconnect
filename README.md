# UniConnect

UniConnect is a full-stack web application for university students and admins to manage courses, resources, and documents. It features authentication, resource sharing, document uploads (with Firebase), and a modern UI built with React, Vite, TailwindCSS, and Framer Motion.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Frontend Usage](#frontend-usage)
- [Document Uploads](#document-uploads)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User registration & login (JWT-based)
- Role-based access (admin/user)
- Course & subject management
- Resource sharing (YouTube links, documents)
- Document upload via Firebase Storage
- Modern, responsive UI
- Toast notifications, animations, protected routes

---

## Tech Stack

**Frontend:**
- React
- Vite
- TailwindCSS
- Framer Motion
- Recoil (state management)
- Axios
- React Hot Toast
- React PDF
- Firebase (Storage)

**Backend:**
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs
- dotenv

---

## Project Structure

```
UniConnect/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── atoms/
│   │   ├── assets/
│   │   ├── firebase.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
├── README.md
└── .gitignore
```

---

## Setup & Installation

### Backend

1. Install dependencies:
	```bash
	cd backend
	npm install
	```
2. Create a `.env` file:
	```
	MONGO_URI=your_mongodb_connection_string
	JWT_SECRET=your_jwt_secret
	```
3. Start the backend server:
	```bash
	npm start
	```

### Frontend

1. Install dependencies:
	```bash
	cd frontend
	npm install
	```
2. Configure Firebase in `src/firebase.js` (already set up).
3. Start the frontend:
	```bash
	npm run dev
	```

---

## Environment Variables

**Backend:**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing

**Frontend:**
- Firebase config is in `src/firebase.js`

---

## API Endpoints

### Auth

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login user
- `PUT /api/auth/update` — Update user profile

### Courses

- `GET /api/courses` — Get all courses
- `POST /api/courses` — Add a new course
- `GET /api/courses/:id` — Get course by ID
- `PUT /api/courses/:id` — Update course
- `DELETE /api/courses/:id` — Delete course

### Subjects

- `GET /api/subject/all-subjects/:classId` — Get all subjects for a class
- `POST /api/subject` — Add a new subject
- `PUT /api/subject/:id` — Update subject
- `DELETE /api/subject/:id` — Delete subject

### Resources

- `GET /api/resource/:classId/:subjectId` — Get resources for a subject
- `POST /api/resource/:classId/:subjectId` — Add a YouTube link resource
- `POST /api/resource/upload/:classId/:subjectId` — Upload a document (multipart/form-data)
- `PUT /api/resource/:subjectId/:classId/:resourceId` — Update resource
- `DELETE /api/resource/:classId/:subjectId/:resourceId` — Delete resource

### Users

- `GET /api/users` — Get all users (admin only)
- `GET /api/users/:id` — Get user by ID
- `DELETE /api/users/:id` — Delete user (admin only)

### Stats

- `GET /api/stats` — Get total users and resources

---

## Frontend Usage

- Register and login as a user or admin.
- Admins can add/edit/delete courses, subjects, and resources.
- Users can view resources, download documents, and access YouTube links.
- Protected routes ensure only authenticated users can access certain pages.

---

## Document Uploads

- Documents are uploaded via Firebase Storage.
- After upload, the file URL is sent to the backend and stored as a resource.
- Supported file types: PDF, DOCX, etc. (Max 10MB)

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

---

## License

MIT

---

If you need more details (like request/response examples, UI screenshots, or developer notes), let me know!
