import { Pipe, PipeTransform } from '@angular/core';

export enum FrequencyFormat {
  minutes = 'minutes',
  hours = 'hours',
  days = 'days',
  weeks = 'weeks',
}

@Pipe({
  name: 'frequency',
  pure: true
})
export class FrequencyPipe implements PipeTransform {

  transform(minutes: number, format?: any): number | string {

    if (!format) {
      if (minutes/60 >= 24) {
        return `${ Math.round( ((minutes/60) / 24) * 100) / 100} d`;
      } else if (minutes/60 >= 1) {
        return `${Math.round((minutes/60) * 100) / 100} h`;
      } else {
        return `${minutes} m`;
      }
    }

    switch (format) {
      case FrequencyFormat.minutes:
        return minutes;
        break;
    
      case FrequencyFormat.hours:
        return Math.round((minutes/60) * 100) / 100;
        break;
    
      default:
        break;
    }
  }

}
