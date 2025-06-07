# 🔁 Reddit Clone App

A full-stack mobile application inspired by Reddit, built using **React Native**, **Spring Boot**, **MongoDB/PostgreSQL**, and deployed with **Docker & Kubernetes**. The architecture is based on **microservices** and **microfrontends** for flexibility and scalability.

---

## 📌 Table of Contents

- [🚀 Project Overview](#-project-overview)
- [🧱 Tech Stack](#-tech-stack)
- [📁 Folder Structure](#-folder-structure)
- [🧩 Architecture](#-architecture)
- [👥 Team & Roles](#-team--roles)
- [📆 Project Timeline](#-project-timeline)
- [📦 Getting Started](#-getting-started)
- [✅ Features](#-features)
- [🛠️ Contributing](#️-contributing)
- [📄 License](#-license)

---

## 🚀 Project Overview

This is a mobile-first Reddit clone app with core Reddit features:

- User registration/login
- Post creation
- Commenting
- Upvote/downvote
- Notifications
- Search functionality

The app is built by a team using modern backend and frontend tools organized by microservices and microfrontends.

---

## 🧱 Tech Stack

### 📱 Frontend (Mobile)

- React Native
- Redux
- Axios
- NativeWind (Tailwind for React Native)

### 🚧 Backend

- Spring Boot (Java)
- MongoDB (Posts & Comments)
- PostgreSQL (Users & Votes)
- Spring Security with JWT
- RESTful APIs

### ⚙️ DevOps

- Docker
- Docker Compose
- Kubernetes (optional)
- Postman (API testing)

---

## 📁 Folder Structure

reddit-clone-app/
├── backend/
│ ├── user-service/
│ ├── post-service/
│ ├── comment-service/
│ ├── vote-service/
│ └── notification-service/
├── frontend/
│ └── mobile-app/ (React Native)
├── api-gateway/
├── docker/
├── k8s/
└── README.md

---

## 🧩 Architecture

- Microservices for isolated domain logic
- API Gateway for routing and auth
- Microfrontends for modular UI in mobile app
- Database-per-service pattern (MongoDB & PostgreSQL)
- RESTful API communication

---

## 👥 Team & Roles

| Name                         | Role                      |
| ---------------------------- | ------------------------- |
| Ewura Adwoa Bentsi           | Project Manager, DB Lead  |
| Samuel Adom Quayson          | Frontend Developer        |
| Christopher Brobbey Boateng  | Frontend Developer        |
| Emmanuel Asare               | Frontend Developer        |
| Yussif Mohammed Harris Malgu | Backend Developer         |
| Jeffery Obeng Gyasi Agyei    | Backend Developer         |
| Charles                      | Backend Developer, DevOps |

---

## 📆 Project Timeline

### Phase 1: Project Kickoff (May 5 - May 9)

- Setup ClickUp & Figma
- Assign roles and tasks

### Phase 2: Backend (May 10 - May 23)

- User & Post services
- Docker setup

### Phase 3: Frontend (May 24 - June 6)

- React Native setup
- Auth UI & Home Feed

### Phase 4: Comment & Voting (June 7 - June 20)

- Comment & Vote services
- Frontend integration

### Phase 5: Notifications & Search (June 21 - July 4)

### Final Phase: Testing & Deployment (July 5 - July 19)

---

## 📦 Getting Started

**Note:** Each team member will work on their assigned microservice or microfrontend module.

### Cloning the Repo

```bash
git clone https://github.com/YOUR-USERNAME/reddit-clone-app.git
cd reddit-clone-app
```

# Backend Setup

cd backend/user-service

# install dependencies

# run the service (check service README for exact commands)

---

## FrontEnd Setup

cd frontend/mobile-app
npm install

# or yarn install

---

# Run the react native app

npx react-native run-android

# or

npx react-native run-ios
