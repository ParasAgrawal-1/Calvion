# Calvion

### Secure Digital Asset Management Platform

Calvion is a full-stack digital asset management platform designed to securely store, organize, manage, and share important digital assets from one place.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)](https://www.java.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

## Features

- User registration and OTP verification
- JWT-based authentication
- Digital asset management
- Document and file uploads
- Asset sharing and permissions
- Shared With Me
- Notifications
- Activity history
- Profile management
- Password management
- Light / Dark / System theme
- Search and filtering
- Responsive UI

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- Lucide React

### Backend
- Java
- Spring Boot
- Spring Security
- JWT
- PostgreSQL
- JPA / Hibernate

## Project Structure

## Project Structure

```text
Calvion/
├── backend/
├── frontend/
├── package.json
├── package-lock.json
└── .gitignore
```
## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Java
- PostgreSQL
- IntelliJ IDEA

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start using Vite.

### Backend Setup

Open the `backend` folder in IntelliJ IDEA and run the Spring Boot application.

Make sure PostgreSQL is running and the database configuration is correctly configured before starting the backend.

## Environment Variables

Keep sensitive configuration only in your local environment.

Do not commit:

- Database passwords
- JWT secrets
- API keys
- Email credentials
- Other sensitive configuration

## Application Modules

### Authentication

- User registration
- OTP verification
- Login
- Forgot password
- Password reset
- JWT authentication

### Digital Assets

- Create assets
- Edit assets
- View asset details
- Upload files
- Search assets
- Filter assets
- Manage asset types

### Sharing

- Share digital assets
- Manage permissions
- Shared With Me
- View shared asset details

### Notifications

- Notification center
- Unread notification count
- Mark notification as read
- Mark all notifications as read
- Sharing and permission notifications

### Activity History

- Asset creation history
- Asset update history
- File upload history
- Workspace activity tracking

### Settings

- Profile management
- Password management
- Appearance settings
- Light theme
- Dark theme
- System theme
- Notification preferences

## Screenshots

### Login
![Login](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### My Assets
![My Assets](screenshots/my-assets.png)

### Shared With Me
![Shared With Me](screenshots/shared-with-me.png)

### Settings
![Settings](screenshots/settings.png)

### Dark Mode
![Dark Mode](screenshots/dark-mode.png)

## Security

Calvion uses JWT-based authentication and Spring Security to protect authenticated resources.

Sensitive configuration such as database credentials and JWT secrets should always remain outside the public repository.

## Future Improvements

- Cloud storage integration
- Advanced search
- Two-factor authentication
- Email notification preferences
- Data export
- Asset expiry reminders
- Improved analytics
- Additional sharing controls

## Author

**Paras Agrawal**

Java Full-Stack Developer | Java | Spring Boot | React | TypeScript
