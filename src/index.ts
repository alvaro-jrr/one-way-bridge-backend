import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { Server as SocketIoServer } from "socket.io";
import { NewCarSchema } from "./features/simulation/models/car";
import * as v from "valibot";
import { Simulation } from "./features/simulation/simulation";

// The Hono app.
const app = new Hono();

// The HTTP server.
const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

// The WebSocket server.
const io = new SocketIoServer(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// The simulation.
const simulation = new Simulation();
let simulationRoom: string | null = null;

// The players.
let players: string[] = [];

io.on("connection", (socket) => {
  console.log(`An user has connected: ${socket.id}`);

  // Join the user to the simulation room.
  socket.on("join-simulation", ({ car }) => {
    const parsedNewCar = v.safeParse(NewCarSchema, car);
    if (!parsedNewCar.success) return;

    const newCar = parsedNewCar.output;

    // Add the car to the simulation.
    simulation.addCar({
      id: socket.id,
      car: newCar,
    });

    if (simulationRoom === null) {
      simulationRoom = `simulation-${socket.id}`;
    }

    // Add player.
    players.push(socket.id);

    // Join the user to the simulation room.
    socket.join(simulationRoom);

    // Notify the user that he has joined the simulation.
    socket.emit("joined-simulation", {
      room: simulationRoom,
      carId: socket.id,
    });

    console.log(
      `An user has joined the simulation: ${socket.id} in ${simulationRoom}`
    );
  });

  // Notify that an user has disconnected.
  socket.on("disconnect", () => {
    // Remove the player from the players array.
    players = players.filter((player) => player !== socket.id);

    console.log(`An user has disconnected: ${socket.id}`);
  });
});

// Run the simulation every second.
setInterval(() => {
  console.log("Running the simulation...");

  if (simulationRoom === null) return;

  // Run the simulation.
  simulation.run();

  // Notify the players about the simulation status.
  io.to(simulationRoom).emit("simulation-status", simulation.getStatus());
}, 1000);
