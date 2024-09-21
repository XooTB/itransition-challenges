import type { Request, Response } from "express";
import type { Pool, QueryResult } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface User {
	id: number;
	name: string;
	email: string;
	password: string;
	last_login_time: Date | null;
	registration_time: Date;
	status: string;
}

class UserController {
	private pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	register = async (req: Request, res: Response): Promise<void> => {
		const { name, email, password } = req.body;

		if (!password || password.length === 0) {
			res.status(400).json({ error: "Password cannot be empty" });
			return;
		}

		try {
			const hashedPassword = await bcrypt.hash(password, 10);
			const result = await this.pool.query(
				"INSERT INTO users (name, email, password, registration_time, status) VALUES ($1, $2, $3, $4, $5) RETURNING id",
				[name, email, hashedPassword, new Date(), "active"],
			);

			const token = this.generateToken(result.rows[0].id.toString());

			res.status(201).json({
				id: result.rows[0].id,
				message: "User registered successfully",
				token,
			});
		} catch (error: any) {
			if (error.constraint === "users_email_idx") {
				res.status(400).json({ error: "Email already exists!" });
			} else {
				res.status(500).json({ error: "Internal Server Error" });
			}
		}
	};

	login = async (req: Request, res: Response): Promise<void> => {
		const { email, password } = req.body;

		try {
			const result = await this.pool.query(
				"SELECT * FROM users WHERE email = $1",
				[email],
			);

			if (result.rows.length === 0) {
				res.status(401).json({ error: "Invalid credentials" });
				return;
			}

			const user = result.rows[0];

			// Check if the user is blocked
			if (user.status === "blocked") {
				res.status(403).json({ error: "User is blocked" });
				return;
			}

			const isValidPassword = await bcrypt.compare(password, user.password);

			if (!isValidPassword) {
				res.status(401).json({ error: "Invalid credentials" });
				return;
			}

			await this.pool.query(
				"UPDATE users SET last_login_time = $1 WHERE id = $2",
				[new Date(), user.id],
			);

			const token = this.generateToken(user.id.toString());

			res.json({
				id: user.id,
				token,
			});
		} catch (error) {
			res.status(500).json({ error: "Internal server error" });
		}
	};

	generateToken = (userId: string): string => {
		const secretToken: string = process.env.JWT_SECRET || "supersecret";
		return jwt.sign({ userId }, secretToken, { expiresIn: "1h" });
	};

	getUsers = async (req: Request, res: Response): Promise<void> => {
		try {
			const result: QueryResult<User> = await this.pool.query(
				"SELECT id, name, email, last_login_time, registration_time, status FROM users",
			);

			res.json(result.rows);
		} catch (error) {
			res.status(500).json({ error: "Internal server error" });
		}
	};

	updateUserStatus = async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;
		const { status } = req.body;

		try {
			const result = await this.pool.query(
				"UPDATE users SET status = $1 WHERE id = $2",
				[status, id],
			);

			if (result.rowCount === 0) {
				res.status(404).json({ error: "User not found" });
				return;
			}

			res.json({ message: "User updated successfully" });
		} catch (error) {
			res.status(500).json({ error: "Internal server error" });
		}
	};

	deleteUser = async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;

		try {
			const result = await this.pool.query("DELETE FROM users WHERE id = $1", [
				id,
			]);

			if (result.rowCount === 0) {
				res.status(404).json({ error: "User not found" });
				return;
			}

			res.json({ message: "User deleted successfully" });
		} catch (error) {
			res.status(500).json({ error: "Internal server error" });
		}
	};
}

export default UserController;
