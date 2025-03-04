import type { Car, Direction } from "./car";

export class WaitingQueue {
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
      currentWaitingTime: car.waitingTime,
      isCrossing: false,
    });

    this.sort();
  }

  /**
   * Add multiple cars to the queue.
   * @param cars The cars to add.
   */
  addMany(cars: Car[]) {
    for (const car of cars) this.add(car);
  }

  /**
   * Get the cars.
   * @returns The cars.
   */
  getCars() {
    return this.queue;
  }

  /**
   * Check if the queue is empty.
   * @returns Whether the queue is empty.
   */
  isEmpty() {
    return this.queue.length === 0;
  }

  /** Get the next car to cross the bridge. */
  getNextCarToCross() {
    return this.queue.find((car) => car.currentWaitingTime === 0);
  }

  /**
   * Get the cars to cross the bridge.
   * And remove them from the queue.
   * @returns The cars to cross the bridge.
   */
  getCarsToCross() {
    return this.queue.filter((car) => car.currentWaitingTime === 0);
  }

  /**
   * Get the cars to cross the bridge by direction.
   * @param direction The direction of the cars to cross.
   * @returns The cars to cross the bridge.
   */
  getCarsToCrossByDirection(direction: Direction) {
    return this.queue.filter(
      (car) => car.currentWaitingTime === 0 && car.direction === direction
    );
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
   * Remove a car from the queue.
   * @param car The car to remove.
   */
  removeCar(car: Car) {
    this.queue = this.queue.filter((item) => item.id !== car.id);
  }

  /**
   * Remove the cars from the queue.
   * @param cars The cars to remove.
   */
  removeCars(cars: Car[]) {
    if (!cars.length) return;

    const ids = cars.map((car) => car.id);

    this.queue = this.queue.filter((car) => !ids.includes(car.id));
  }

  /**
   * Sort the queue.
   */
  sort() {
    this.queue = [...this.queue].sort(
      (a, b) => this.prioritySelector(a) - this.prioritySelector(b)
    );
  }

  /**
   * The priority selector.
   * @param car The car.
   * @returns The priority of the car.
   */
  private prioritySelector(car: Car) {
    return car.currentWaitingTime;
  }
}
