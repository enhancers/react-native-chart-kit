// NOTE: do not export utils outside this npm package (to be used only internally)
export const isNumeric = value =>
  ['string', 'number'].includes(typeof value) &&
  !isNaN(Number(value)) &&
  isFinite(Number(value));
export const numericOrDefault = (value, defaultValue) =>
  isNumeric(value) ? Number(value) : defaultValue;
// Returns a new date shifted a certain number of days (can be negative)
export const shiftDate = (date, numDays) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
};
export const getBeginningTimeForDate = date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());
// obj can be a parseable string, a millisecond timestamp, or a Date object
export const convertToDate = value =>
  value instanceof Date ? value : new Date(value);
//# sourceMappingURL=utils.js.map
