import express from "express";
import type { Express, Request, Response } from "express";
import { Pool } from "pg";
import UserController from "./controllers/UserController";
import AuthMiddleware from "./middleware/AuthMiddleware";
import cors from "cors";

const app: Express = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
	user: process.env.PG_USERNAME,
	host: process.env.PG_HOST,
	database: process.env.PG_DATABASE,
	password: process.env.PG_PASSWORD,
	port: Number.parseInt(process.env.PG_PORT || "5432"),
});

const userController = new UserController(pool);
const authMiddleware = new AuthMiddleware(pool);

app.post("/register", userController.register);
app.post("/login", userController.login);
app.get("/users", authMiddleware.authenticate, userController.getUsers);
app.post(
	"/changestatus/:id",
	authMiddleware.authenticate,
	userController.updateUserStatus,
);
app.delete(
	"/delete/:id",
	authMiddleware.authenticate,
	userController.deleteUser,
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
