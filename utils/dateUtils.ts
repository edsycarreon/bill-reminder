import {
  format,
  parse,
  addMonths,
  subMonths,
  isSameMonth,
  getDate,
  isAfter,
  isBefore,
} from "date-fns";

/**
 * Format a date to YYYY-MM format
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatYearMonth = (date: Date): string => {
  return format(date, "yyyy-MM");
};

/**
 * Parse a YYYY-MM string to a Date object
 * @param yearMonth String in YYYY-MM format
 * @returns Date object (first day of month)
 */
export const parseYearMonth = (yearMonth: string): Date => {
  return parse(yearMonth, "yyyy-MM", new Date());
};

/**
 * Get the previous month of a given YYYY-MM string
 * @param yearMonth String in YYYY-MM format
 * @returns Previous month in YYYY-MM format
 */
export const getPreviousMonth = (yearMonth: string): string => {
  const date = parseYearMonth(yearMonth);
  return formatYearMonth(subMonths(date, 1));
};

/**
 * Get the next month of a given YYYY-MM string
 * @param yearMonth String in YYYY-MM format
 * @returns Next month in YYYY-MM format
 */
export const getNextMonth = (yearMonth: string): string => {
  const date = parseYearMonth(yearMonth);
  return formatYearMonth(addMonths(date, 1));
};

/**
 * Check if a bill is due soon (within the next 3 days)
 * @param dueDay Day of month when bill is due
 * @param month Month in YYYY-MM format
 * @returns True if bill is due soon
 */
export const isDueSoon = (dueDay: number, month: string): boolean => {
  const today = new Date();
  const dueDate = parse(`${month}-${dueDay}`, "yyyy-MM-dd", new Date());
  const currentMonth = formatYearMonth(today);

  // Only check bills in the current month
  if (month !== currentMonth) {
    return false;
  }

  // Calculate days until due
  const todayDate = getDate(today);
  return dueDay > todayDate && dueDay <= todayDate + 3;
};

/**
 * Check if a bill is overdue
 * @param dueDay Day of month when bill is due
 * @param month Month in YYYY-MM format
 * @returns True if bill is overdue
 */
export const isOverdue = (dueDay: number, month: string): boolean => {
  const today = new Date();
  const dueDate = parse(`${month}-${dueDay}`, "yyyy-MM-dd", new Date());

  // If it's a past month, it's overdue
  if (isBefore(parseYearMonth(month), parseYearMonth(formatYearMonth(today)))) {
    return true;
  }

  // If it's the current month, check if the due day has passed
  if (isSameMonth(dueDate, today)) {
    return getDate(today) > dueDay;
  }

  return false;
};

/**
 * Format a YYYY-MM string to a human-readable month format
 * @param yearMonth String in YYYY-MM format
 * @returns Formatted month name with year
 */
export const formatMonthName = (yearMonth: string): string => {
  const date = parseYearMonth(yearMonth);
  return format(date, "MMMM yyyy");
};

/**
 * Generate an array of months for the month selector
 * @param centerMonth The current month in YYYY-MM format
 * @param range Number of months before and after center month
 * @returns Array of month strings in YYYY-MM format
 */
export const getMonthRange = (centerMonth: string, range: number): string[] => {
  const centerDate = parseYearMonth(centerMonth);
  const months: string[] = [];

  for (let i = -range; i <= range; i++) {
    const date = addMonths(centerDate, i);
    months.push(formatYearMonth(date));
  }

  return months;
};

/**
 * Get the current month in YYYY-MM format
 * @returns Current month as YYYY-MM
 */
export const getCurrentMonth = (): string => {
  return formatYearMonth(new Date());
};
