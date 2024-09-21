// // File: app.ts
import express, { Express, Request, Response } from "express";
import { Pool } from "pg";
import UserController from "./controllers/UserController";
import AuthMiddleware from "./middleware/AuthMiddleware";

const app: Express = express();
app.use(express.json());

const pool = new Pool({
	user: "your_username",
	host: "localhost",
	database: "your_database",
	password: "your_password",
	port: 5432,
});

const userController = new UserController(pool);
const authMiddleware = new AuthMiddleware(pool);

app.post("/register", userController.register);
app.post("/login", userController.login);
app.get("/user", authMiddleware.authenticate, userController.getUser);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// File: controllers/UserController.ts

// // File: middleware/AuthMiddleware.ts
// import { Request, Response, NextFunction } from 'express';
// import { Pool } from 'pg';
// import jwt from 'jsonwebtoken';

// interface DecodedToken {
//   userId: number;
// }

// declare global {
//   namespace Express {
//     interface Request {
//       userId?: number;
//     }
//   }
// }

// class AuthMiddleware {
//   private pool: Pool;

//   constructor(pool: Pool) {
//     this.pool = pool;
//   }

//   authenticate = (req: Request, res: Response, next: NextFunction): void => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       res.status(401).json({ error: 'No token provided' });
//       return;
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//       const decoded = jwt.verify(token, 'your_jwt_secret') as DecodedToken;
//       req.userId = decoded.userId;
//       next();
//     } catch (error) {
//       res.status(401).json({ error: 'Invalid token' });
//     }
//   }
// }

// export default AuthMiddleware;

// // SQL for creating the users table and index (unchanged)
// // /*
// CREATE TABLE users (
//   id SERIAL PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   email VARCHAR(255) NOT NULL,
//   password VARCHAR(255) NOT NULL,
//   last_login_time TIMESTAMP,
//   registration_time TIMESTAMP NOT NULL,
//   status VARCHAR(50) NOT NULL
// );

// CREATE UNIQUE INDEX users_email_idx ON users (email);
// // */
