// check object equality (for objects with the same property order)
export const isObjectEqualShallow = (o1: object, o2: object) =>
  JSON.stringify(o1) === JSON.stringify(o2);
