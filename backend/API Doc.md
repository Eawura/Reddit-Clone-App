# NeoPing API Documentation

## Authentication

- **POST /api/auth/login** — User login
- **POST /api/auth/signup** — User registration
- **POST /api/auth/refresh/token** — Refresh JWT token
- **POST /api/auth/logout** — Logout
- **GET /api/auth/accountVerification/{token}** — Account verification

## User Profile

**POST /api/profile** — Create user profile
**GET /api/profile/{username}** — Get user profile
**PUT /api/profile/{username}** — Update user profile (avatar, bio, email, password)

## Posts

- **POST /api/posts** — Create a new post

- **GET /api/posts** — List all posts (supports pagination, category)
- **GET /api/posts/{id}** — Get a single post by ID
- **PUT /api/posts/{id}** — Update a post
- **DELETE /api/posts/{id}** — Delete a post
- **GET /api/posts/popular** — Get popular posts (sorted by vote count)
- **GET /api/posts/latest** — Get latest posts (sorted by date)
- **GET /api/posts/new** — Get new posts
- **GET /api/posts/category/{category}** — Get posts by category
- **GET /api/posts/user/{username}** — Get posts by user

## Comments

## Comments

- **POST /api/comments** — Add a comment to a post
- **GET /api/comments/{postId}** — Get comments for a post
- **PUT /api/comments/{id}** — Update a comment
- **DELETE /api/comments/{id}** — Delete a comment

## News
- **POST /api/news/{id}/comment** — Add a comment to a news article
- **GET /api/news/{id}/comments** — Get comments for a news article

- **GET /api/news** — List news articles (supports search, category, pagination)
- **GET /api/news/{id}** — Get news article by ID
- **POST /api/news/{id}/upvote** — Upvote a news article
- **POST /api/news/{id}/downvote** — Downvote a news article
- **POST /api/news/{id}/bookmark** — Bookmark a news article

## Communities

- **GET /api/communities** — List all communities
- **POST /api/communities** — Create a new community
- **GET /api/communities/{id}** — Get community by ID

## Chat

- **POST /api/chat/send** — Send a chat message

- **GET /api/chat/between/{user1Id}/{user2Id}** — Get messages between two users

## Inbox

- **POST /api/inbox/{conversationId}/message** — Send a new message in a conversation

- **GET /api/inbox** — List all conversations for the authenticated user
- **GET /api/inbox/{conversationId}** — Get all messages in a conversation
- **POST /api/inbox/{conversationId}/mark-read** — Mark conversation as read

## Notifications

- **GET /api/notifications** — List notifications for the authenticated user
- **POST /api/notifications/mark-read** — Mark all notifications as read
- **POST /api/notifications/{id}/mark-read** — Mark a single notification as read

## Videos (Watch)

- **GET /api/videos** — List all videos (supports search, category, pagination)
- **GET /api/videos/{id}** — Get video by ID
- **POST /api/videos** — Upload a new video (if enabled)

---

**All endpoints requiring authentication expect a JWT token in the Authorization header.**
