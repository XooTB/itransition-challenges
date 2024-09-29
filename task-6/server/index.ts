import express from "express";
import http from "http";
import PresentationHandler from "./handlers/PresentationHandler";
import pool from "./db/db";
import { Server } from "socket.io";
import cors from "cors";
import Presentation from "./controllers/PresentationController";

// Express app setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

const presentationHandler = new PresentationHandler(pool);

// Routes
app.post("/new", presentationHandler.newPresentation);
app.get("/presentations", presentationHandler.getAllPresentations);
app.get("/presentations/:id", presentationHandler.getPresentationById);

// Socket.io setup
io.on("connection", (socket) => {
  // Join a presentation room
  socket.on("join_presentation", async (presentationId, data) => {
    socket.join(presentationId);

    try {
      // Fetch the current presentation state from the database
      const presentation = await Presentation.getPresentationById(
        presentationId
      );

      // Emit the current presentation state to the newly joined user
      socket.emit("presentation_updated", presentation);
    } catch (error) {
      console.error("Error fetching presentation:", error);
      socket.emit("join_error", { message: "Failed to join presentation" });
    }
  });

  // Handle presentation updates
  socket.on("update_presentation", async (data) => {
    const { presentationId, presentation } = data;

    try {
      // Update the entire presentation in the database
      await presentationHandler.updatePresentation(
        presentationId,
        presentation
      );

      // Emit the presentation update to all clients in the room, including the sender
      io.in(presentationId).emit("presentation_updated", {
        presentationId,
        presentation,
      });

      console.log(`Updated presentation ${presentationId}`);
    } catch (error) {
      socket.emit("update_error", { message: "Failed to update presentation" });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
