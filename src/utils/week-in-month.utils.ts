export function getWeeksInMonth(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const totalDaysInMonth = lastDay.getDate();

  const weeks = Math.ceil((totalDaysInMonth + firstDay.getDay()) / 7);

  return weeks;
}
