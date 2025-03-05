import type { Car } from "./car";

export abstract class CarQueue {
  /** The queue of cars. */
  protected queue: Car[];

  constructor() {
    this.queue = [];
  }

  /**
   * Add a car to the queue.
   * @param car The car to add.
   */
  abstract add(car: Car): void;

  /**
   * Add multiple cars to the queue.
   * @param cars The cars to add.
   */
  addMany(cars: Car[]) {
    for (const car of cars) this.add(car);
  }

  /**
   * Get the cars in the queue.
   * @returns The cars in the queue.
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

  /**
   * Tick the queue.
   */
  abstract tick(): void;

  /**
   * Remove a car from the queue.
   * @param car The car to remove.
   */
  remove(car: Car) {
    this.queue = this.queue.filter((c) => c.id !== car.id);
  }

  /**
   * Remove a car from the queue by id.
   * @param id The id of the car to remove.
   * @returns Whether the car was removed.
   */
  removeById(id: string) {
    const carIndex = this.queue.findIndex((c) => c.id === id);
    if (carIndex === -1) return false;

    this.queue = this.queue.splice(carIndex, 1);
    return true;
  }

  /**
   * Remove multiple cars from the queue.
   * @param cars The cars to remove.
   */
  removeMany(cars: Car[]) {
    if (!cars.length) return;

    const carsIds = cars.map((c) => c.id);
    this.queue = this.queue.filter((c) => !carsIds.includes(c.id));
  }
}
