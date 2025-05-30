import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment-timezone';

@Injectable()
export class TimezoneService {
    private readonly timezone: string;

    constructor(private configService: ConfigService) {
        this.timezone = this.configService.get<string>('TIMEZONE', 'America/Bogota');
    }

    /**
     * Formats a date according to the application timezone
     * @param date Date or string to format
     * @returns Date object in the correct timezone
     */
    formatDate(date: Date | string): Date | null {
        if (!date) return null;

        const parsedDate = typeof date === 'string' ? new Date(date) : new Date(date);

        // Using Intl.DateTimeFormat for more reliable timezone conversion
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: this.timezone,
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
        });

        const parts = formatter.formatToParts(parsedDate);
        const dateComponents: Record<string, number> = {};

        parts.forEach(part => {
            if (part.type !== 'literal') {
                dateComponents[part.type] = parseInt(part.value, 10);
            }
        });

        return new Date(
            dateComponents.year,
            dateComponents.month - 1, // Month is 0-based in JS Date
            dateComponents.day,
            dateComponents.hour,
            dateComponents.minute,
            dateComponents.second
        );
    }

    /**
     * Gets the current date in the application timezone
     * @returns Current date
     */
    getCurrentDate(): Date {
        const result = this.formatDate(new Date());
        return result || new Date(); // Fallback to now if formatting fails
    }

    /**
     * Formats a date to ISO string for API responses
     * @param date Date to format 
     * @returns ISO string representation
     */
    toISOString(date: Date | string): string | null {
        const formatted = this.formatDate(date);
        return formatted ? formatted.toISOString() : null;
    }

    /**
     * Converts a date to the application timezone
     * @param date Date to convert
     * @returns Converted date
     */
    toTimezone(date: Date | string): string | null {
        if (!date) return null;
        return moment(date).tz(this.timezone).format();
    }

    /**
     * Creates a date object for the start of a day in the application timezone
     * @param date Base date
     * @returns Date object set to start of day
     */
    startOfDay(date: Date | string): Date | null {
        const formatted = this.formatDate(date);
        if (!formatted) return null;

        formatted.setHours(0, 0, 0, 0);
        return formatted;
    }

    /**
     * Creates a date object for the end of a day in the application timezone
     * @param date Base date
     * @returns Date object set to end of day
     */
    endOfDay(date: Date | string): Date | null {
        const formatted = this.formatDate(date);
        if (!formatted) return null;

        formatted.setHours(23, 59, 59, 999);
        return formatted;
    }
}