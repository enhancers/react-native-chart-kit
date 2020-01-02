// NOTE: do not export utils outside this npm package (to be used only internally)

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export const isNumeric = (value: any): boolean =>
  ['string', 'number'].includes(typeof value) &&
  !isNaN(Number(value)) &&
  isFinite(Number(value));

export const numericOrDefault = (
  value: string | number | undefined | null,
  defaultValue: number,
) => (isNumeric(value) ? Number(value) : defaultValue);

// Returns a new date shifted a certain number of days (can be negative)
export const shiftDate = (date: Date, numDays: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
};

export const getBeginningTimeForDate = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

// obj can be a parseable string, a millisecond timestamp, or a Date object
export const convertToDate = (value: number | string | Date): Date =>
  value instanceof Date ? value : new Date(value);
