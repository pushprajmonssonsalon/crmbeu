// validTo and appointmentDate use the calendar date displayed by the CRM.
export function membershipValid(member, appointmentDate, now = Date.now()) {
  const expiry = new Date(member?.validTo);
  if (!member?.validTo || !Number.isFinite(expiry.getTime())) return false;
  const lastDay = expiry.toISOString().slice(0, 10);
  const today = new Date(now + 330 * 60000).toISOString().slice(0, 10);
  return lastDay >= today && (!appointmentDate || lastDay >= String(appointmentDate).slice(0, 10));
}
