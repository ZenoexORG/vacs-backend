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

export function getDateRange(baseDate: Date = new Date()) {
  const base = moment.tz(baseDate, 'America/Bogota').startOf('day');
  const tomorrow = base.clone().add(1, 'day');
  return {
    base: base.utc().toDate(),
    tomorrow: tomorrow.utc().toDate()
  };
}

export function formatReportDate(date: Date | string): string {  
  const d = moment.tz(date, 'America/Bogota');
  return d.format('DD [de] MMMM [de] YYYY');
}

export function formatDate(date: Date | string): string {
  const d = moment.tz(date, 'America/Bogota');
  return d.format('YYYY-MM-DD');
}