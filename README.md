# FraudGuard - Fraud Detection Dashboard

FraudGuard is a full-stack MERN application designed for collaborative fraud detection and management. It provides a platform for users to report suspicious websites and for administrators to verify, manage, and track these threats.

![FraudGuard Dashboard Preview](https://via.placeholder.com/800x400?text=FraudGuard+Dashboard+Screenshot)

## Table of Contents
- [Features](#features)
- [Live Demo](#live-demo)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Features

### Role-Based Access Control (RBAC)
- **User**: View verified threats, report suspicious websites, manage profile
- **Analyst**: Analyze data (promoted by admin)
- **Admin**: Full CRUD access, manage user roles, verify/deny reports

### Secure Authentication
- JWT-based authentication with bcryptjs password hashing

### Interactive Admin Dashboard
- At-a-glance statistics
- Chart.js visualizations (risk level distribution)
- Live activity feed

### Complete Fraud Management Workflow
- "Request for Blocking" submission
- Verification Queue for new reports
- Status management: Approve (Block), Deny (Delete), Under Investigation

### Dynamic UI
- Responsive interface with React and Tailwind CSS
- Real-time notifications (React Hot Toast)
- Dynamic filtering and searching

## Live Demo
Access the deployed application:  
[https://fraud-guard-vci6.vercel.app](https://fraud-guard-vci6.vercel.app)

## Technology Stack

**Frontend:**
- React
- React Router
- Axios
- Tailwind CSS
- Chart.js
- Lucide React (Icons)
- React Hot Toast (Notifications)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- Bcrypt.js

**Database:**
- MongoDB (local or Atlas)



text

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- MongoDB (local or Atlas connection)

### Backend Setup
1. Navigate to server directory:
```bash
cd server
Install dependencies:

bash
npm install
Create .env file:

env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
Seed initial data:

bash
npm run data:import
Start server:

bash
npm run server
Frontend Setup
Navigate to client directory:

bash
cd client
Install dependencies:

bash
npm install
Start development server:

bash
npm start
Usage
User Roles
Admin Account:
Email: admin@frauddashboard.com
Password: password123

New Users: Register via "Sign Up" link

Application Workflow
User registers account

User logs in and views verified threats

User reports suspicious URL via "Request Website Blocking"

Admin reviews report in Verification Queue

Admin updates status (Approve, Deny, or Under Investigation)

Approved URLs appear in public "Verified Threat List"

API Endpoints
Method	Endpoint	Description
POST	/api/auth/login	User login
POST	/api/auth/register	New user registration
GET	/api/fraud-data	Get public data
POST	/api/fraud-data/report	Submit fraud report
GET	/api/admin/data	Get all data (admin only)
PUT	/api/admin/urls/:id/status	Update URL status (admin only)
GET	/api/users	Get all users (admin only)
PUT	/api/users/:id	Update user role (admin only)
Future Enhancements
Email notifications for report status updates

Enhanced analytics (reports over time, top categories)

Automated URL scanning (Google Safe Browsing API)

User profile management (password change)

Two-factor authentication

Mobile application version

License
This project is licensed under the MIT License.
