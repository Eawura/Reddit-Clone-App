// Utility functions for time calculations and formatting

/**
 * Calculate the relative time since a given timestamp
 * @param {Date|string|number} timestamp - The timestamp to calculate from
 * @returns {string} - Formatted relative time string
 */
export const getRelativeTime = (timestamp) => {
  const now = new Date();
  const postTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now - postTime) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
};

/**
 * Generate a random timestamp within the last 7 days
 * @returns {Date} - Random timestamp
 */
export const getRandomRecentTimestamp = () => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
  const randomTime = sevenDaysAgo.getTime() + Math.random() * (now.getTime() - sevenDaysAgo.getTime());
  return new Date(randomTime);
};

/**
 * Generate a random timestamp within the last 24 hours
 * @returns {Date} - Random timestamp
 */
export const getRandomTodayTimestamp = () => {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
  const randomTime = oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime());
  return new Date(randomTime);
};

/**
 * Generate a random timestamp within the last hour
 * @returns {Date} - Random timestamp
 */
export const getRandomRecentHourTimestamp = () => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));
  const randomTime = oneHourAgo.getTime() + Math.random() * (now.getTime() - oneHourAgo.getTime());
  return new Date(randomTime);
}; 