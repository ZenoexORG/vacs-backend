import * as moment from 'moment-timezone';

export function getMonthRange(month: number, year?: number): { start: Date; end: Date } {
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}`);
  }
  const currentYear = year || new Date().getFullYear();
  const start = moment.tz(
    { year: currentYear, month: month - 1, day: 1, hour: 0, minute: 0, second: 0 },
    'America/Bogota'
  );
  const end = start.clone().endOf('month').set({ hour: 23, minute: 59, second: 59 });
  return {
    start: start.utc().toDate(),
    end: end.utc().toDate(),
  };
}

export function getDateRange(baseDate = new Date()) {
  let localDate;

  if (baseDate instanceof Date) {
    const dateString = baseDate.toISOString().split('T')[0];
    localDate = moment.tz(dateString, 'America/Bogota');
  } else {
    localDate = moment.tz(baseDate, 'America/Bogota');
  }

  const startOfDay = localDate.clone().startOf('day');
  const endOfDay = localDate.clone().endOf('day');

  return {
    base: startOfDay.utc().toDate(),
    tomorrow: endOfDay.utc().toDate()
  };
}

export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
  const d = moment.tz(date, 'America/Bogota');
  return d.format(format);
}

export function normalizeDateToUTC(date: Date | string): Date {
  const d = moment.tz(date, 'America/Bogota');
  return d.utc().toDate();
}