# 🛠️ Contributing to Reddit Clone App

Welcome, team! Please follow these steps to contribute smoothly:

1. **Clone the Repository**
   git clone https://github.com/YOUR-USERNAME/reddit-clone-app.git
   cd reddit-clone-app

2. **Work in Your Assigned Folder**

- Only make changes inside your own microservice or microfrontend module.

3. **Create a New Branch**
   Always create a feature branch before working:
   git checkout -b feature/your-feature-name

🔖 Examples:

- `feature/signup-ui`
- `bugfix/post-service-error`
- `hotfix/comment-crash`

4. **Write Clear Commit Messages**
   Example:
   git commit -m "Implement login API in user-service"

5. **Push Your Code**
   git push origin your-branch-name

- After pushing, open a Pull Request on GitHub and request a review from a team member or the PM.

6. **Run Tests (If Any)**

- For Spring Boot:
  ```
  ./mvnw test
  ```
- For Node.js:
  ```
  npm test
  ```

7. **Stay Updated**
   Always pull the latest code from `main` before starting work:
   git checkout main
   git pull origin main

8. **What is being worked on**

| Folder |
|----------------------------------
| `backend/user-service`  
| `backend/post-service`  
| `backend/comment-service`  
| `backend/vote-service`  
| `backend/notification-service`  
| `frontend/mobile-app`  
| `api-gateway/`  
| `docker/` and `k8s/`
