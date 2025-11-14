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

### ***Concept: N-Level Connections (Graph-Based)***

Each **user** is a **node**, and each **connection** is an **edge**.

---

### Example Graph

| ID | Name | Connections(JSON) |
|----|------|-------------------|
| U1 | Suraj | {"U2": true, "U3": true} |
| U2 | Alice | {"U1": true, "U4": true} |
| U3 | Bob   | {"U1": true, "U5": true} |
| U4 | Charlie | {"U2": true, "U6": true} |
| U5 | David | {"U3": true} |
| U6 | Emma  | {"U4": true} |

---

### Example Query

`GET /users/U1/connections/2`

**Level 1:** U2, U3  
**Level 2:** U4, U5  

**Final merged:** U2, U3, U4, U5

**Example Response:**
```json
{
  "userId": "U1",
  "level": 2,
  "connections": [
    { "id": "U2", "name": "Alice" },
    { "id": "U3", "name": "Bob" },
    { "id": "U4", "name": "Charlie" },
    { "id": "U5", "name": "David" }
  ]
}
```

---

## Summary

```
Level 0 → U1  
Level 1 → U2, U3  
Level 2 → U4, U5  
Level 3 → U6  
```

Now `/connections/3` → U2, U3, U4, U5, U6
