# devTinder Backend

A Node.js / Express backend for a developer matching and connection request application.

## Features

- User signup and login with JWT authentication via secure HTTP-only cookies
- User profile retrieval and profile updates
- Password change flow
- Connection request system with pending and accepted states
- Mongoose schema validation for user data

## Setup

1. Copy `.env.example` to `.env`
2. Set `MONGO_URI`, `JWT_SECRET`, and `PORT`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm run start
   ```

## Environment variables

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - HTTP port for the server

## Scripts

- `npm run start` - run the server
- `npm run dev` - run the server with nodemon
- `npm run start:dev` - run the server with nodemon
- `npm test` - placeholder test command
- npx jest --coverage Coverage the unitest cases
- npm test run the test cases

## Main files

- `server.js` - application bootstrap and database connection
- `src/app.js` - Express app configuration and route registration
- `src/config/db.js` - MongoDB connection logic
- `src/models/user.js` - User schema and helper methods
- `src/models/connection.js` - Connection request schema
- `src/controllers/` - request handlers
- `src/middlewares/` - validation, auth, and error handling

## API routes

### Authentication

- `POST /auth/signup` - register a new user
- `POST /auth/login` - log in and set authentication cookie
- `POST /auth/logout` - clear the auth cookie

### User profile

- `GET /user/profile/view` - view authenticated user profile
- `PATCH /user/profile/edit` - update profile fields
- `PATCH /user/profile/password/change` - change password

### Connections

- `POST /connections/send/:receiverId` - send a connection request
- `POST /connections/review/:connectionId/:status` - accept or reject a pending request
- `GET /connections/sent` - list user's sent connection requests
- `GET /connections/getPendingRequests` - list pending incoming requests
- `GET /connections/getAcceptedConnections` - list accepted connections

## Improvement notes

- Add request/response tests
- Add rate limiting and CORS for production
- Add a proper API error middleware and central validation layer
