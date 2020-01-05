export declare type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
export declare const isNumeric: (value: any) => boolean;
export declare const numericOrDefault: (
  value: string | number | null | undefined,
  defaultValue: number,
) => number;
export declare const shiftDate: (date: Date, numDays: number) => Date;
export declare const getBeginningTimeForDate: (date: Date) => Date;
export declare const convertToDate: (value: string | number | Date) => Date;
