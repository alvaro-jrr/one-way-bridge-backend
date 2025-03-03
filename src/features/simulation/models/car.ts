import * as v from "valibot";

/** The direction schema. */
const DirectionSchema = v.union([
  v.literal("left-to-right"),
  v.literal("right-to-left"),
]);

/** The direction type. */
export type Direction = v.InferOutput<typeof DirectionSchema>;

/** The new car schema. */
export const NewCarSchema = v.object({
  /** The time it takes for the car to cross the bridge. */
  bridgeTime: v.pipe(v.number(), v.toMinValue(1)),
  /** The time it takes for the car to wait before crossing the bridge. */
  waitingTime: v.pipe(v.number(), v.toMinValue(1)),
  /** The current car direction. */
  direction: DirectionSchema,
});

/** The new car type. */
export type NewCar = v.InferOutput<typeof NewCarSchema>;

/** The car type. */
export type Car = NewCar & {
  /** The current car id. */
  id: string;
  /** The current bridge time. */
  currentBridgeTime: number;
  /** The current waiting time. */
  currentWaitingTime: number;
  /** Wether the car is crossing the bridge. */
  isCrossing: boolean;
  /** Wether the car is removed from the simulation. */
  isRemoved: boolean;
};
