# Base Authentication Project

## Overview

This repository serves as a **starter template for Node.js/Express projects** with **authentication and security features** already implemented.

It includes:

* User registration and login using **JWT** stored in **HttpOnly cookies**
* **CSRF protection** for sensitive routes
* Middleware for authentication and protected routes
* Password hashing with **bcrypt**
* Pre-configured **CORS** and **Helmet** for security
* Example routes for testing (`/register`, `/login`, `/logout`, `/profile`)

This base can be **cloned and extended** for future projects that require secure user authentication out of the box.

---

## Features

* ✅ JWT authentication with HttpOnly cookie
* ✅ CSRF protection for POST/PUT/DELETE routes
* ✅ Password hashing with bcrypt
* ✅ Authentication middleware for protected routes
* ✅ Logout route clearing the JWT cookie
* ✅ Preconfigured security headers with Helmet
* ✅ CORS configuration ready for frontend integration

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/base-auth-project.git
cd base-auth-project
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file at the root and add:

```env
SERVER_PORT=3000
JWT_SECRET=your_jwt_secret
```

4. Start the server:

```bash
npm run dev
```

The server will run on `http://localhost:3000`.

---

## Available Routes

| Route                      | Method | Description                                   |
| -------------------------- | ------ | --------------------------------------------- |
| `/api/users/register`      | POST   | Create a new user                             |
| `/api/users/login`         | POST   | Login a user and set JWT cookie               |
| `/api/users/logout`        | POST   | Logout user and clear cookie (CSRF protected) |
| `/api/users/profile`       | GET    | Protected route, requires JWT                 |
| `/api/security/csrf-token` | GET    | Get CSRF token for frontend usage             |

---

## Frontend Integration

* Include credentials in fetch requests to send cookies:

```javascript
fetch("/api/users/profile", {
  credentials: "include",
  headers: {
    "CSRF-Token": csrfToken
  }
})
```

* Always fetch the **CSRF token** before POST/PUT/DELETE requests.

---

## Usage

1. Clone this repo whenever you start a new project requiring authentication.
2. Extend routes and controllers according to your project needs.
3. Keep authentication and CSRF middleware in place for security.

---

## License

MIT License
