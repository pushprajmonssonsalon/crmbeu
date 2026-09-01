/**
 * How often the royalty reminder is allowed to interrupt someone.
 *
 * It used to be dispatched on every route change, so it reappeared on every tab
 * switch. The limit is now time-based instead of navigation-based: at most two
 * in a day, and never within five hours of the last one.
 */
const STORAGE_KEY = "royaltyReminder.shows";
const MAX_PER_DAY = 2;
const MIN_GAP_MS = 5 * 60 * 60 * 1000;

// Falls back to memory when localStorage is unavailable (private windows, or a
// browser set to block site data). The limit then applies for the session only,
// which is still far better than showing it on every navigation.
let memoryFallback = null;

// The salon's own day, not UTC - a reminder at 11pm and one at 1am are two
// different days to the person looking at the screen.
const today = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
};

const read = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return memoryFallback;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch (error) {
    return memoryFallback;
  }
};

const write = (record) => {
  memoryFallback = record;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch (error) {
    // Nothing to do - memoryFallback still holds it for this session.
  }
};

/** Whether the reminder may be shown right now. */
export const canShowRoyaltyReminder = () => {
  const record = read();
  if (!record || record.date !== today()) return true;   // first one today
  if (Number(record.count) >= MAX_PER_DAY) return false;
  const since = Date.now() - Number(record.lastShownAt || 0);
  return since >= MIN_GAP_MS;
};

/** Record that it was actually put on screen. */
export const recordRoyaltyReminderShown = () => {
  const record = read();
  const isSameDay = record && record.date === today();
  write({
    date: today(),
    count: isSameDay ? Number(record.count || 0) + 1 : 1,
    lastShownAt: Date.now(),
  });
};

export const ROYALTY_REMINDER_LIMITS = { MAX_PER_DAY, MIN_GAP_MS, STORAGE_KEY };
