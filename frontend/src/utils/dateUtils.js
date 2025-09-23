// src/utils/dateUtils.js

import { format, parseISO } from "date-fns";

/**
 * Format a date string (ISO or Date object) into "yyyy-MM-dd" format
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  try {
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    return format(parsedDate, "yyyy-MM-dd");
  } catch (error) {
    console.error("Invalid date:", date);
    return "";
  }
}

/**
 * Format a date string (ISO or Date object) into human-readable format
 * Example: "dd MMM yyyy"
 * @param {string|Date} date
 * @returns {string}
 */
export function formatReadableDate(date) {
  try {
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    return format(parsedDate, "dd MMM yyyy");
  } catch (error) {
    console.error("Invalid date:", date);
    return "";
  }
}
