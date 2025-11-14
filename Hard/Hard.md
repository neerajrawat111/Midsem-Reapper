# Social Connection Service – Node.js + Express + Prisma

This backend service allows users to connect with each other — similar to friend connections on social platforms.  
Built with **Node.js**, **Express**, and **Prisma ORM**.

---

## Features

- Create and manage user accounts  
- Connect or disconnect users  
- Retrieve **N-level connections** (friends of friends, etc.)  
- Prevent circular or duplicate connections  

---

## 1. Database Design 

### **Model: `User`**

**Fields Description:**
- **id** → Unique identifier primary key  
- **name** → User’s full name  
- **email** → Unique email address  
- **connections** → A **JSON object** storing connected user IDs  
- **createdAt** → Timestamp of creation  
- **updatedAt** → Timestamp of update  

---

## 2. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/users` | Create a new user |
| **POST** | `/connect` | Connect two users |
| **POST** | `/disconnect` | Disconnect two users |
| **GET** | `/users/:id/connections/:level` | Fetch N-level connections |

---

## 3. API Details

### **a. Create User**

**Endpoint:**  
`POST /users`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "connections": {},
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

---

### **b. Connect Users**

**Endpoint:**  
`POST /connect`

**Request Body:**
```json
{
  "userId1": "uuid-1",
  "userId2": "uuid-2"
}
```

**Response:**
```json
{
  "message": "Users connected successfully",
  "user1Connections": { "uuid-2": true },
  "user2Connections": { "uuid-1": true }
}
```

---

### **c. Disconnect Users**

**Endpoint:**  
`POST /disconnect`

**Request Body:**
```json
{
  "userId1": "uuid-1",
  "userId2": "uuid-2"
}
```

**Response:**
```json
{
  "message": "Users disconnected successfully"
}
```

---

## ***Get N-Level Connections***

**Endpoint:**
`GET /users/:id/connections/:level`

---

### ***Concept: N-Level Connections***

Each **user** is a **node**, and each **connection** is an **edge**.
### ***Graph Levels***
![Graph](./graph.png)

### Example Query

`GET /users/uuid/connections/2`

**Example Response:**
```json
{
  "userId": "uuid",
  "level": 2,
  "connections": [
    { "id": "uuid", "name": "Alice" },
    { "id": "uuid", "name": "Bob" },
    { "id": "uuid", "name": "Charlie" },
    { "id": "uuid", "name": "David" }
  ]
}
```

---

