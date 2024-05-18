/**
 *
 * @param year
 * @param month
 * @returns week in month
 */
export function getWeeksInMonth(year: number, month: number): number {
  let weeks: number = 0;
  const date = new Date();
  date.setFullYear(year);
  date.setMonth(month - 1);

  for (let index = 1; index < 31; index++) {
    date.setDate(index);

    if (date.getDay() == 0) {
      weeks++;
    }
  }

  return weeks;
}
