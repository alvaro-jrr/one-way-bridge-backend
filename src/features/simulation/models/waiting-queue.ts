import type { Car, Direction } from "./car";
import { CarQueue } from "./car-queue";

export class WaitingQueue extends CarQueue {
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
      currentWaitingTime: car.waitingTime,
      isCrossing: false,
    });

    this.sort();
  }

  /**
   * Get the cars by direction.
   * @param direction The direction.
   * @returns The cars.
   */
  getCarsByDirection(direction: Direction) {
    return this.queue.filter((car) => car.direction === direction);
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
  getCarsToCross(direction?: Direction) {
    return this.queue.filter((car) => {
      if (direction) {
        return car.currentWaitingTime === 0 && car.direction === direction;
      }

      return car.currentWaitingTime === 0;
    });
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
