// Sum in paise so employee subtotals and exported totals agree.
export function redemptionTotals(rows) {
  const sum = key => rows.reduce((n, row) => n + Math.round((row[key] || 0) * 100), 0) / 100;
  return { redemption: sum("redemption"), redemptionShare: sum("redemptionShare") };
}

export const rupees = value => (value || 0).toLocaleString("en-IN", {
  style: "currency", currency: "INR", minimumFractionDigits: 2
});
