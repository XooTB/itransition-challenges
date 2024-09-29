import type { Pool } from "pg";
import express from "express";
import Presentation from "../controllers/PresentationController";

interface newPresentation {
  title: string;
  creator: string;
  data: any;
}

export default class PresentationHandler {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async newPresentation(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const { title, creator, data }: newPresentation = req.body;

    if (!title || !creator || !data) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    try {
      const presentation = new Presentation(title, creator, data);
      await presentation.save();
      res.status(201).json(presentation);
    } catch (error) {
      console.error("Error creating presentation:", error);
      if (error instanceof Error) {
        res
          .status(500)
          .json({ error: `Failed to create presentation: ${error.message}` });
      } else {
        res
          .status(500)
          .json({ error: "Failed to create presentation: Unknown error" });
      }
    }
  }

  async getAllPresentations(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const presentations = await Presentation.getAll();
      res.status(200).json(presentations);
    } catch (error) {
      console.error("Error fetching presentations:", error);
      if (error instanceof Error) {
        res
          .status(500)
          .json({ error: `Failed to fetch presentations: ${error.message}` });
      }
    }
  }

  async getPresentationById(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const { id } = req.params;

    try {
      const presentation = await Presentation.getPresentationById(id);
      res.status(200).json(presentation);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch presentation by ID",
      });
    }
  }

  async updatePresentation(presentationId: string, presentation: any) {
    const query = "UPDATE presentation SET presentation = $1 WHERE id = $2";
    await this.pool.query(query, [
      JSON.stringify(presentation),
      presentationId,
    ]);
  }
}
