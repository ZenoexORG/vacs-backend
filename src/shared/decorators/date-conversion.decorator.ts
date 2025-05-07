import { SetMetadata } from "@nestjs/common";

export const DATE_FIELDS_KEY = 'dateFields';
export const ConvertDates = (dateFileds: string[]) => SetMetadata(DATE_FIELDS_KEY, dateFileds);