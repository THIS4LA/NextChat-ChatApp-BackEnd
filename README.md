# 💬 Real-Time Chat Backend (Node.js + Express + Socket.IO)

A **real-time chat backend** built with **Node.js**, **Express**, **MongoDB**, and **Socket.IO**.  
It handles user authentication, conversations, messaging, and live socket updates — powering a modern real-time chat experience with features like **typing indicators**, **online users**, and **JWT-secured APIs**.

---

## 🧠 Overview

This backend is designed to serve as the foundation for a chat or messaging application (like WhatsApp or Messenger clone).  
It provides RESTful APIs for user management and conversation handling, and uses Socket.IO for instant updates between connected users.

---

## 🚀 Features

- 🔐 **Authentication** – Register & login with JWT tokens  
- 👤 **User Management** – Update profiles, search users, and fetch user data  
- 💬 **Conversations & Messages** – Send and fetch messages in real-time  
- ⚡ **Socket.IO Integration** – Real-time chat updates, typing indicators, and online user tracking  
- 🟢 **Online Status** – Know which users are currently active  
- 🧱 **Clean Architecture** – Modular Express routes and controllers  
- 🐳 **Docker Support** – Easy containerized deployment  

---

## 📂 API Routes Overview

| Route | Method | Description |
|-------|---------|-------------|
| `/api/auth/register` | **POST** | Register a new user |
| `/api/auth/login` | **POST** | Login and receive a JWT token |
| `/api/conversations/` | **POST** | Create a new conversation |
| `/api/conversations/` | **GET** | Get user’s conversations |
| `/api/messages/` | **POST** | Send a message |
| `/api/messages/:id` | **GET** | Get all messages in a conversation |
| `/api/users/search` | **GET** | Search for available users |
| `/api/users/:id` | **GET** | Get user details by ID |
| `/api/users/:id` | **PUT** | Update user details |

---

## ⚡ Socket.IO Events

| Event | Direction | Description |
|--------|------------|-------------|
| `userConnected` | client → server | Add user to online list |
| `updateOnlineUsers` | server → all | Broadcast list of all online users |
| `userLogout` | client → server | Remove user from online list |
| `joinConversation` | client → server | Join a conversation room |
| `typing` | client → server | Notify others that user is typing |
| `stopTyping` | client → server | Notify others that user stopped typing |
| `sendMessage` | client → server | Send a new message to server |
| `newMessage` | server → room | Deliver message to all participants |
| `disconnect` | auto | Handle user disconnection |

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and configure the following:

```env
MONGO_URL=<your_mongodb_connection_string>
PORT=<port_number>
JWT_SECRET=<your_jwt_secret_key>
FRONTEND_URL=<your_frontend_url>
```

---

## 🚀 Getting Started

1️⃣ Clone the Repository

```bash
git clone https://github.com/THIS4LA/NextChat-ChatApp-BackEnd.git
```

```bash
cd NextChat-ChatApp-BackEnd
```

2️⃣ Install Dependencies

```bash
npm install
```

3️⃣ Configure Environment Variables
(Create a .env file)

```bash
MONGO_URL=<your_mongodb_connection_string>
PORT=8080
JWT_SECRET=<your_jwt_secret_key>
FRONTEND_URL=<your_frontend_url>
```

4️⃣ Run the Server

```bash
npm run dev
```
Server will run at:
👉 http://localhost:8080

---

## 🐳 Docker Setup

1️⃣ Build the Image

```bash
docker build -t nextchat-backend .
```

2️⃣ Run the Container

```bash
docker run -d -p 8080:8080 --env-file .env nextchat-backend
```

3️⃣ Or use Docker Compose

```bash
docker compose up -d
```

---

## 🤝 Contributing

Contributions are always welcome!

To contribute:

 1️⃣ Fork the repo

 2️⃣ Create a new branch (feature/my-feature)

 3️⃣ Commit your changes

 4️⃣ Push and open a pull request 🚀

 ---

## 👨‍💻 Author

Developed by: [THIS4LA](https://github.com/THIS4LA)

Repository: [NextChat-ChatApp-BackEnd](https://github.com/THIS4LA/NextChat-ChatApp-BackEnd)

  ---

## 🌟 Show Your Support

If you found this project helpful, please ⭐ the repository to show your support and help it grow!

 ---

