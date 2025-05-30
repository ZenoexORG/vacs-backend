import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import * as moment from 'moment';

export function IsNotFutureDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isNotFutureDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                    return value && moment(value).isSameOrBefore(moment());
                },
                defaultMessage(_args: ValidationArguments) {
                    return 'Timestamp must not be in the future';
                },
            },
        });
    };
}