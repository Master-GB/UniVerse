# UniVerse - Academic & Career Support Management System (ACSMS)

## 📌 Overview
UniVerse is a comprehensive Academic & Career Support Management System designed to bridge the gap between students, mentors, and academic resources. This full-stack application provides a unified platform for mentorship, course management, resource sharing, and career development.

## 🚀 Features

### 🎓 Student Features
- **Course Management**: Enroll in courses, track progress, and access learning materials
- **Mentorship Program**: Connect with experienced mentors and schedule sessions
- **Resource Hub**: Access a vast library of academic resources and past papers
- **Career Development**: Build resumes, prepare for interviews, and explore career opportunities
- **Guidance & Support**: Get academic and career guidance from mentors

### 👨‍🏫 Mentor Features
- **Mentor Dashboard**: Manage mentorship sessions and track student progress
- **Resource Management**: Share resources, articles, and study materials
- **Announcements**: Post important updates and announcements
- **Career Sessions**: Conduct career guidance sessions and workshops

### 📚 Academic Resources
- **Past Papers**: Access a collection of previous exam papers
- **Study Materials**: Comprehensive study guides and reference materials
- **Quiz System**: Practice with subject-specific quizzes
- **Interview Preparation**: Mock interviews and common interview questions

## 🛠 Tech Stack

### Frontend
- **Framework**: React.js (v19.1.1)
- **State Management**: React Context API
- **UI Components**: Custom components with Framer Motion for animations
- **Routing**: React Router DOM (v7.8.1)
- **HTTP Client**: Axios
- **Document Generation**: jsPDF, html2pdf.js, html2canvas
- **Icons**: Lucide React, React Icons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **AI Integration**: Google Generative AI
- **Security**: bcryptjs for password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas or local MongoDB instance

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd UniVerse
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your configuration
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Update .env with your configuration
   ```

4. **Start the development servers**
   - Backend:
     ```bash
     cd ../backend
     npm run dev
     ```
   - Frontend (in a new terminal):
     ```bash
     cd frontend
     npm start
     ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8070

## 📂 Project Structure

```
UniVerse/
├── backend/                 # Backend server
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Custom middleware
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── uploads/             # File uploads
│   ├── .env                 # Environment variables
│   └── server.js            # Main server file
│
└── frontend/                # Frontend React application
    ├── public/              # Static files
    └── src/                 # Source code
        ├── components/      # Reusable UI components
        ├── pages/           # Page components
        ├── assets/          # Images, styles, etc.
        ├── context/         # React context providers
        ├── utils/           # Utility functions
        └── App.js           # Main App component
```

## 🔒 Environment Variables

### Backend (.env)
```
PORT=8070
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8070
# Add other frontend environment variables here
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **DevSquad** - Development Team

## 📧 Contact

For any inquiries, please reach out to [your-email@example.com](mailto:your-email@example.com)

---

<div align="center">
  Made with ❤️ by DevSquad
</div>
