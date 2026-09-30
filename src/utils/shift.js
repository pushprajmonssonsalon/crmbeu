
const to12h = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const minutes = m ? `:${String(m).padStart(2, "0")}` : "";
  return `${h % 12 || 12}${minutes}${suffix}`;
};

const to24h = (part) => {
  const match = /^(\d{1,2})(?::(\d{2}))?(AM|PM)$/i.exec(part.trim());
  if (!match) return "";
  const hour = (Number(match[1]) % 12) + (match[3].toUpperCase() === "PM" ? 12 : 0);
  return `${String(hour).padStart(2, "0")}:${match[2] || "00"}`;
};

// ("09:00", "17:00") -> "9AM to 5PM"; "" unless both are set.
export const formatShift = (start, end) =>
  start && end ? `${to12h(start)} to ${to12h(end)}` : "";

// "9AM to 5PM" -> { start: "09:00", end: "17:00" }; blanks if it can't be read.
export const parseShift = (shift) => {
  const parts = String(shift || "").split(/\s+to\s+/i);
  if (parts.length !== 2) return { start: "", end: "" };
  const start = to24h(parts[0]);
  const end = to24h(parts[1]);
  return start && end ? { start, end } : { start: "", end: "" };
};
