export const DAY_NAMES = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getMonday(date: Date): Date {
  const monday = new Date(date);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function buildMonthGrid(year: number, month: number): Array<Date | null> {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const totalCells = Math.ceil((startPadding + lastDay.getDate()) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const day = index - startPadding + 1;
    if (day < 1 || day > lastDay.getDate()) {
      return null;
    }
    return new Date(year, month, day);
  });
}

export function formatMonthYear(date: Date): string {
  return `Thang ${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function formatWeekRangeLabel(baseDate: Date): string {
  const monday = getMonday(baseDate);
  const sunday = addDays(monday, 6);
  const format = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  return `${format(monday)} - ${format(sunday)}`;
}
