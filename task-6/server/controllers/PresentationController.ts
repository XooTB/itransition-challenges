import pool from "../db/db";
import { v4 as uuidv4 } from "uuid";

export default class Presentation {
  id: string;
  title: string;
  creator: string;
  presentation: any[];

  constructor(title: string, creator: string, presentation: any[]) {
    this.id = uuidv4();
    this.title = title;
    this.creator = creator;
    this.presentation = presentation;
  }

  async save(): Promise<void> {
    try {
      const query = `
        INSERT INTO presentation (id, title, creator, presentation)
        VALUES ($1, $2, $3, $4)
      `;
      const values = [
        this.id,
        this.title,
        this.creator,
        JSON.stringify(this.presentation),
      ];

      await pool.query(query, values);
    } catch (error) {
      console.error("Error saving presentation:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to save presentation: ${error.message}`);
      } else {
        throw new Error("Failed to save presentation: Unknown error");
      }
    }
  }

  static async getAll(): Promise<any> {
    try {
      const query = "SELECT * FROM presentation";
      const result = await pool.query(query);

      return result.rows.map((row) => ({
        id: row.id,
        title: row.title,
        creator: row.creator,
        presentation: row.presentation,
      }));
    } catch (error) {
      console.error("Not Working", error);
    }
  }

  static async getPresentationById(id: string): Promise<Presentation | null> {
    try {
      const query = "SELECT * FROM presentation WHERE id = $1";
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      console.log(result.rows[0]);
      const { title, creator, presentation } = result.rows[0];
      return new Presentation(title, creator, presentation);
    } catch (error) {
      console.error("Error fetching presentation by ID:", error);
      throw new Error("Failed to fetch presentation by ID");
    }
  }

  static async updatePresentation(
    id: string,
    updatedData: Partial<Presentation>
  ): Promise<Presentation | null> {
    try {
      const query = `
        UPDATE presentation
        SET title = COALESCE($1, title),
            creator = COALESCE($2, creator),
            presentation = COALESCE($3, presentation)
        WHERE id = $4
        RETURNING *
      `;

      const values = [
        updatedData.title,
        updatedData.creator,
        updatedData.presentation
          ? JSON.stringify(updatedData.presentation)
          : null,
        id,
      ];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return null;
      }

      const { title, creator, presentation } = result.rows[0];
      return new Presentation(title, creator, presentation);
    } catch (error) {
      console.error("Error updating presentation:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to update presentation: ${error.message}`);
      } else {
        throw new Error("Failed to update presentation: Unknown error");
      }
    }
  }
}
