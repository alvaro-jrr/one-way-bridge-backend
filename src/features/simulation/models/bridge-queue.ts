import type { Car } from "./car";
import { CarQueue } from "./car-queue";

export class BridgeQueue extends CarQueue {
  constructor() {
    super();
  }

  /**
   * Add a car to the queue.
   * @param car The car to add.
   */
  add(car: Car) {
    this.queue.push({
      ...car,
      currentBridgeTime: this.getEstimatedBridgeTime(car),
      isCrossing: true,
    });
  }

  /**
   * Get the estimated bridge time of a car.
   * @param car The car.
   * @returns The estimated bridge time.
   */
  private getEstimatedBridgeTime(car: Car) {
    // As there are no cars in the queue, the estimated bridge time is the car bridge time.
    if (!this.queue.length) return car.bridgeTime;

    const lastCarBridgeTime =
      this.queue[this.queue.length - 1].currentBridgeTime;

    // When the last car in the queue will spend more time in the bridge than the current car,
    // the estimated bridge time is the last car bridge time.
    // Otherwise, the estimated bridge time is the current car bridge time.
    return lastCarBridgeTime > car.bridgeTime
      ? lastCarBridgeTime
      : car.bridgeTime;
  }

  /**
   * Get the cars that have completed the bridge.
   * And remove them from the queue.
   * @returns The cars that have completed the bridge.
   */
  getCompletedBridgeCars() {
    return this.queue.filter((car) => car.currentBridgeTime === 0);
  }

  /**
   * Tick the queue.
   */
  tick() {
    // Update the time spent waiting.
    this.queue = this.queue.map((car) => {
      const nextBridgeTime =
        car.currentBridgeTime > 0 ? car.currentBridgeTime - 1 : 0;

      return { ...car, currentBridgeTime: nextBridgeTime };
    });
  }

  /**
   * Mark a car as removed.
   * @param id The id of the car to remove.
   */
  markCarAsRemoved(id: string) {
    const carIndex = this.queue.findIndex((car) => car.id === id);
    if (carIndex === -1) return;

    this.queue[carIndex].isRemoved = true;
  }
}
