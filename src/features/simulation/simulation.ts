import { BridgeQueue } from "./models/bridge-queue";
import type { NewCar } from "./models/car";
import { WaitingQueue } from "./models/waiting-queue";

export class Simulation {
  // The waiting queue.
  private waitingQueue: WaitingQueue;

  // The bridge queue.
  private bridgeQueue: BridgeQueue;

  constructor() {
    this.waitingQueue = new WaitingQueue();
    this.bridgeQueue = new BridgeQueue();
  }

  /**
   * Add a car to the waiting queue.
   * @param car The car to add.
   */
  addCar({ car, id }: { car: NewCar; id: string }) {
    this.waitingQueue.add({
      ...car,
      id,
      currentBridgeTime: 0,
      currentWaitingTime: car.waitingTime,
      isCrossing: false,
      isRemoved: false,
    });
  }

  /**
   * Run the simulation.
   */
  run() {
    // If there are no cars to cross, we don't need to perform any action.
    if (this.waitingQueue.isEmpty() && this.bridgeQueue.isEmpty()) {
      return;
    }

    // Tick the queues.
    this.waitingQueue.tick();
    this.bridgeQueue.tick();

    // Move the cars that have already crossed the bridge to the other side.
    this.moveBridgeCars();

    // Move the cars to the bridge queue.
    this.moveCarsToBridge();
  }

  /**
   * Get the status of the simulation.
   * @returns The status of the simulation.
   */
  getStatus() {
    return {
      waitingQueue: this.waitingQueue.getCars(),
      bridgeQueue: this.bridgeQueue.getCars(),
    };
  }

  /**
   * Move the cars that have already crossed the bridge to the other side.
   */
  private moveBridgeCars() {
    // If the bridge is empty, we don't need to move any cars.
    if (this.bridgeQueue.isEmpty()) return;

    const carsToCross = this.bridgeQueue.getAlreadyCrossedCars();
    if (carsToCross.length === 0) return;

    // Remove the cars from the bridge.
    this.bridgeQueue.removeCars(carsToCross);

    // Move the cars to the other side.
    const currentDirection = carsToCross[0].direction;

    this.waitingQueue.addMany(
      carsToCross.map((car) => ({
        ...car,
        direction:
          currentDirection === "left-to-right"
            ? "right-to-left"
            : "left-to-right",
      }))
    );
  }

  /**
   * Move the cars to the bridge queue.
   */
  private moveCarsToBridge() {
    // If the bridge is not empty, we don't need to move any cars.
    if (!this.bridgeQueue.isEmpty()) return;

    // There's no car to cross.
    const nextCar = this.waitingQueue.getNextCarToCross();
    if (!nextCar) return;

    // Get the cars to cross the bridge by direction.
    const carsToCross = this.waitingQueue.getCarsToCrossByDirection(
      nextCar.direction
    );

    // Remove the cars from the waiting queue.
    this.waitingQueue.removeCars(carsToCross);

    // Add the cars to the bridge.
    this.bridgeQueue.addMany(carsToCross);
  }
}
