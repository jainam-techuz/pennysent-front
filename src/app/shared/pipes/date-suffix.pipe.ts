import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateSuffix' })
export class DateSuffix implements PipeTransform {
    transform(value: string): string {
        if (!value) { return value; }

        let suffix = 'th';
        let day = value.substr(4, 2);

        if (day === '01' || day === '21' || day === '31') {
            suffix = 'st'
        } else if (day === '02' || day === '22') {
            suffix = 'nd';
        } else if (day === '03' || day === '23') {
            suffix = 'rd';
        }

        return `${value.substr(0, 6)}${suffix}, ${value.substr(7)}`;
    }
}