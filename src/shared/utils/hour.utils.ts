import * as moment from 'moment-timezone'

export function initializeHourlyData(): Record<number, number> {
  const hourlyData: Record<number, number> = {};
  for (let i = 0; i < 24; i++) {
    hourlyData[i] = 0;
  }
  return hourlyData;
}

export function hourUtcToLocal(hour: number): number {
  const utcHour = moment.utc().startOf('day').add(hour, 'hours');
  return utcHour.tz('America/Bogota').hour();
}