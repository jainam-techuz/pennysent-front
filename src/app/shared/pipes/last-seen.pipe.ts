import * as moment from "moment";
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'lastSeen' })
export class LastSeenPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) { return value; }

        const format = 'YYYY-MM-DD HH:mm';
        const time = moment(value, format).format(format);
        const currTime = moment();
        let lastSeen;

        if (currTime.diff(time, 'seconds') > 60 && currTime.diff(time, 'minutes') < 60) {
            lastSeen = currTime.diff(time, 'minutes') + ' minutes ago';
        } else if (currTime.diff(time, 'minutes') > 60 && currTime.diff(time, 'hours') < 24) {
            lastSeen = currTime.diff(time, 'hours') + ' hours ago';
        } else if (currTime.diff(time, 'hours') >= 24 && currTime.diff(time, 'days') === 1) {
            lastSeen = '1 day ago';
        } else if (currTime.diff(time, 'days') > 1 && currTime.diff(time, 'days') < 7) {
            lastSeen = currTime.diff(time, 'days') + ' days ago';
        } else if (currTime.diff(time, 'days') >= 7) {
            lastSeen = 'a while ago';
        }

        return lastSeen;
    }
}