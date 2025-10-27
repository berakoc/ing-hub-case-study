export function formatDateToDefault(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function parseDate(dateString) {
  if (!dateString && dateString !== 0) return null;

  if (dateString instanceof Date) {
    return isNaN(dateString.getTime())
      ? null
      : new Date(dateString.getFullYear(), dateString.getMonth(), dateString.getDate());
  }

  const s = String(dateString).trim();
  if (!s) return null;

  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const d = new Date(s);
    if (!isNaN(d)) return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  const parts = s.split(/[/.-]/).map((p) => p.trim());
  if (parts.length !== 3) return null;

  const nums = parts.map(Number);
  if (nums.some((n) => Number.isNaN(n))) return null;

  let day, month, year;

  const [a, b, c] = nums;

  if (String(parts[0]).length === 4) {
    year = a;
    month = b;
    day = c;
  } else if (String(parts[2]).length === 4) {
    year = c;
    if (b > 12 && b <= 31) {
      month = a;
      day = b;
    } else if (a > 12 && a <= 31) {
      day = a;
      month = b;
    } else {
      day = a;
      month = b;
    }
  } else {
    return null;
  }

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  const dt = new Date(year, month - 1, day);

  if (dt.getFullYear() !== year || dt.getMonth() !== month - 1 || dt.getDate() !== day) {
    return null;
  }

  return dt;
}
