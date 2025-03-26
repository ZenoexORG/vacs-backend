export function getMonthRange(month: number, year?:number): {start: Date, end: Date} {
    const currentYear = year || new Date().getFullYear();
    const start = new Date(currentYear, month - 1, 1);
    const end = new Date(currentYear, month, 0, 23, 59, 59);
    return { start, end }
}