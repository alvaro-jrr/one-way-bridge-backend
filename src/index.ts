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
    origin: ["http://localhost:5173", "http://localhost:4173"],
    methods: ["GET", "POST"],
  },
});

// The simulation.
const simulation = new Simulation();
let simulationRoom: string | null = null;
let simulationInterval: NodeJS.Timeout | null = null;

// The players.
let players: string[] = [];

/**
 * Handles the simulation interval.
 */
const onSimulationInterval = () => {
  if (simulationRoom === null) return;

  // Notify the players about the simulation status.
  io.to(simulationRoom).emit("simulation-status", simulation.getStatus());

  // Run the simulation.
  simulation.run();
};

io.on("connection", (socket) => {
  console.log(`An user has connected: ${socket.id}`);

  // Join the user to the simulation room.
  socket.on("join-simulation", ({ car }) => {
    const parsedNewCar = v.safeParse(NewCarSchema, car);
    if (!parsedNewCar.success) return;

    const newCar = parsedNewCar.output;

    if (simulationRoom === null) {
      simulationRoom = `simulation-${socket.id}`;

      // Start the simulation interval.
      simulationInterval = setInterval(onSimulationInterval, 1000);
    }

    // Add player.
    players.push(socket.id);

    // Join the user to the simulation room.
    socket.join(simulationRoom);

    // Notify the user that he has joined the simulation.
    socket.emit("joined-simulation", {
      carId: socket.id,
    });

    console.log(
      `An user has joined the simulation: ${socket.id} in ${simulationRoom}`
    );

    // Add the car to the simulation.
    simulation.addCar({
      id: socket.id,
      car: newCar,
    });
  });

  // Notify that an user has disconnected.
  socket.on("disconnect", () => {
    // Remove the player from the players array.
    players = players.filter((player) => player !== socket.id);

    // Clear the simulation if there are no players.
    if (!players.length) {
      // Clear the simulation interval.
      if (simulationInterval) clearInterval(simulationInterval);

      // Clear the simulation room.
      simulationRoom = null;
    }

    // Remove the car from the simulation.
    simulation.removeCar(socket.id);

    console.log(`An user has disconnected: ${socket.id}`);
  });
});
