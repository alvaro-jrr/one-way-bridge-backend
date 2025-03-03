import type { Car } from "./car";

export class BridgeQueue {
  /** The queue of cars. */
  private queue: Car[];

  constructor() {
    this.queue = [];
  }

  /**
   * Add a car to the queue.
   * @param car The car to add.
   */
  add(car: Car) {
    this.queue.push({
      ...car,
      currentBridgeTime: this.getCarEstimatedBridgeTime(car),
      isCrossing: true,
    });
  }

  /**
   * Add multiple cars to the queue.
   * @param cars The cars to add.
   */
  addMany(cars: Car[]) {
    for (const car of cars) this.add(car);
  }

  /**
   * Check if the queue is empty.
   * @returns Whether the queue is empty.
   */
  isEmpty() {
    return this.queue.length === 0;
  }

  /**
   * Get the estimated bridge time of a car.
   * @param car The car.
   * @returns The estimated bridge time.
   */
  getCarEstimatedBridgeTime(car: Car) {
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
   * Get the cars.
   * @returns The cars.
   */
  getCars() {
    return this.queue;
  }

  /**
   * Get the cars that have already crossed the bridge.
   * And remove them from the queue.
   * @returns The cars that have already crossed the bridge.
   */
  getAlreadyCrossedCars() {
    return this.queue.filter((car) => car.currentBridgeTime === 0);
  }

  /**
   * Tick the queue.
   */
  tick() {
    // Update the time spent waiting.
    this.queue = this.queue.map((car) => {
      const nextWaitingTime =
        car.currentWaitingTime > 0 ? car.currentWaitingTime - 1 : 0;

      return { ...car, currentWaitingTime: nextWaitingTime };
    });
  }

  /**
   * Remove the cars from the queue.
   * @param cars The cars to remove.
   */
  removeCars(cars: Car[]) {
    if (!cars.length) return;

    this.queue = this.queue.filter((car) =>
      cars.some((item) => item.id == car.id)
    );
  }
}
