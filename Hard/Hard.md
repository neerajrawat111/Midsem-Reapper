# Social Connection Service – Node.js + Express + Prisma

This backend service allows users to connect each other — similar to friend connections on social platforms.  
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
- **id** → Unique identifier primary key default Auto generated
- **name** → User’s full name  
- **email** → Unique email address for login or identification  
- **connections** → An array that stores IDs of connected users  
- **createdAt** → Timestamp of user creation (default: current time)  
- **updatedAt** → Timestamp of last update (auto-updates when modified)

---

## 2. API Endpoints

| Method | Endpoint | Description |
|:-------|:----------|:-------------|
| **POST** | `/users` | Create a new user |
| **POST** | `/connect` | Connect two users |
| **POST** | `/disconnect` | Disconnect two users |
| **GET** | `/users/:id/connections/:level` | Fetch N-level user connections |

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

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "b1a4d9a3-52b4-4eaa-9cc3-8a9c87d22e6f",
    "name": "John Doe",
    "email": "john@example.com",
    "connections": [],
    "createdAt": "2025-11-13T09:25:12.235Z",
    "updatedAt": "2025-11-13T09:25:12.235Z"
  }
}
```

**Error Responses:**
- `400`: Missing required fields  
- `409`: Email already exists  

---

### **b. Connect Users**

**Endpoint:**  
`POST /connect`

**Request Body:**
```json
{
  "userId1": "uuid-of-user-1",
  "userId2": "uuid-of-user-2"
}
```

**Rules:**
- Both users must exist  
- A user cannot connect to themselves  
- Update both users’ `connections` arrays

**Response (200 OK):**
```json
{
  "message": "Users connected successfully",
  "user1Connections": ["uuid-of-user-2"],
  "user2Connections": ["uuid-of-user-1"]
}
```

**Error Responses:**
- `400`: Users cannot connect to themselves  
- `404`: One or both users not found  

---

### **c. Disconnect Users**

**Endpoint:**  
`POST /disconnect`

**Request Body:**
```json
{
  "userId1": "uuid-of-user-1",
  "userId2": "uuid-of-user-2"
}
```

**Action:**
- Remove each user’s ID from the other’s connections array

**Response (200 OK):**
```json
{
  "message": "Users disconnected successfully"
}
```

**Error Responses:**
- `404`: One or both users not found  
- `400`: Users are not connected  

---

### ***Get N-Level Connections***

## Endpoint
`GET /users/:id/connections/:level`

**Example Request:**
```
GET /users/b1a4d9a3-52b4-4eaa-9cc3-8a9c87d22e6f/connections/2
```

---

### ***Concept: N-Level Connections***

Every **user** is a **node**, and every **connection** is an **edge** between users — similar to a social graph.

| Level | Meaning | Example |
|-------|----------|----------|
| **Level 1** | Direct connections (friends) | A → B |
| **Level 2** | Friends + Friends of friends | A → B → C |
| **Level 3** | Friends + Friends of friends + Next circle | A → B → C → D |

---

***Example Data***

| ID | Name | Connections |
|----|------|-------------|
| U1 | Suraj | U2, U3 |
| U2 | Alice | U1, U4 |
| U3 | Bob | U1, U5 |
| U4 | Charlie | U2, U6 |
| U5 | David | U3 |
| U6 | Emma | U4 |

***Graph Visualization***

```
        U5(David)
          |
U1(Suraj) - U3(Bob)
  |
  U2(Alice)
  |
  U4(Charlie)
  |
  U6(Emma)
```

---

***Example Query***

**Request:**
```
GET /users/U1/connections/2
```

### Step 1 — Level 1 (Immediate Connections)
U1 → [U2, U3]

### Step 2 — Level 2 (Friends of Level 1 Connections)
- U2 → [U1, U4] → exclude U1 → add U4  
- U3 → [U1, U5] → exclude U1 → add U5  

 Level 2: [U4, U5]

### Step 3 — Merge & Remove Duplicates
Final connections up to level 2 → [U2, U3, U4, U5]

---

**Example Response (200 OK)**
```json
{
  "userId": "U1",
  "level": 2,
  "connections": [
    { "id": "U2", "name": "Alice", "email": "alice@example.com" },
    { "id": "U3", "name": "Bob", "email": "bob@example.com" },
    { "id": "U4", "name": "Charlie", "email": "charlie@example.com" },
    { "id": "U5", "name": "David", "email": "david@example.com" }
  ]
}
```

---

**Error Responses**

| Status Code | Description | 
|--------------|-------------|
| **400*** | Invalid level number 
| **404*** | User not found | 

---

**Visual Summary**

```
Level 0 → [U1]
Level 1 → [U2, U3]
Level 2 → [U4, U5]
Level 3 → [U6]
```

So:
- `/connections/1` → Alice, Bob  
- `/connections/2` → Alice, Bob, Charlie, David  
- `/connections/3` → Alice, Bob, Charlie, David, Emma


