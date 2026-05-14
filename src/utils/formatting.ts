/**
 * Format a number as USD currency.
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date string as relative time (e.g. "2h ago", "14m ago", "1d ago").
 */
export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(dateString);
};

/**
 * Format a date string to "MMM DD" (e.g. "OCT 24").
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return `${months[date.getMonth()]} ${date.getDate()}`;
};

/**
 * Format a date string to "HH:MM" 24-hour time.
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

/**
 * Format a number with thousand separators.
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};

/**
 * Get a date label for grouping transactions (TODAY, YESTERDAY, or date string).
 */
export const getDateGroupLabel = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(date, today)) return `TODAY, ${formatDate(dateString)}`;
  if (isSameDay(date, yesterday)) return `YESTERDAY, ${formatDate(dateString)}`;
  return formatDate(dateString);
};

/**
 * Generate a simple unique ID.
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Get the current greeting based on time of day.
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};
