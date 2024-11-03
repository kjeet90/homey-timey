'use strict';

import Homey from 'homey';
import { isCurrentTimeBetween, isEarlierThan, isLaterThan, convertDecimalToHHmm, convertHToHHmm, convertHmmToHHmm } from './lib/time';


class Timey extends Homey.App {

  previousTime = '';
  currentTime = '';
  timeZone: string = '';
  formatter: Intl.DateTimeFormat | null = null;

  HmmRegEx = new RegExp(/^(?:[01]?[0-9]|2[0-3]):[0-5][0-9]$/);
  HdecimalRegEx = new RegExp(/^(?:[01]?[0-9]|2[0-3])\.[0-9]+$/);
  HRegEx = new RegExp(/^(0?[0-9]|1[0-9]|2[0-3])$/);


  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    await this.initFlows();
    this.timeZone = await this.homey.clock.getTimezone();
    this.formatter = new Intl.DateTimeFormat([], {
      timeZone: this.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23' // Homeys' example with '12hour: false' uses 24 for midnight
    });
    this.log('Timey has been initialized');
    this.homey.setInterval(() => {
      this.tick();
    }, 1000);
  }

  validateAndGetTime(timestamp: string) {
    timestamp = timestamp.trim();
    if (timestamp.includes(':') && this.HmmRegEx.test(timestamp)) return convertHmmToHHmm(timestamp);
    else if (timestamp.includes('.') && this.HdecimalRegEx.test(timestamp)) return convertDecimalToHHmm(timestamp);
    else if (this.HRegEx.test(timestamp)) return convertHToHHmm(timestamp);
    return null;
  }

  async initFlows() {
    this.homey.flow.getConditionCard('time-is-earlier-than').registerRunListener(async (args, _state) => {
      const validatedTime = this.validateAndGetTime(args.Time.toString());
      if (validatedTime === null) {
        this.error(`Incorrect format (${args.Time}) in condition flow card: 'time-is-earlier-than'`);
        throw this.homey.__("wrong-format", { input: args.Time });
      }
      const result = isEarlierThan(validatedTime, this.currentTime);
      this.log(`Returning ${result} in time-is-earlier-than flow with time ${args.Time}(${validatedTime}) and the time is now ${this.currentTime}`);
      return result;
    })

    this.homey.flow.getConditionCard('time-is-later-than').registerRunListener(async (args, _state) => {
      const validatedTime = this.validateAndGetTime(args.Time.toString());
      if (validatedTime === null) {
        this.error(`Incorrect format (${args.Time}) in condition flow card: 'time-is-later-than'`);
        throw this.homey.__("wrong-format", { input: args.Time });
      }
      const result = isLaterThan(validatedTime, this.currentTime);
      this.log(`Returning ${result} in time-is-later-than flow with time ${args.Time}(${validatedTime}) and the time is now ${this.currentTime}`);
      return result;
    })

    this.homey.flow.getConditionCard('time-is-between').registerRunListener(async (args, _state) => {
      const validatedTime1 = this.validateAndGetTime(args.Time1.toString());
      const validatedTime2 = this.validateAndGetTime(args.Time2.toString());
      if (validatedTime1 === null || validatedTime2 === null) {
        const wrong = !validatedTime1 ? args.Time1 : args.Time2;
        this.error(`Incorrect format (${wrong}) in condition flow card: 'time-is-between'`);
        throw this.homey.__("wrong-format", { input: wrong });
      }
      const result = isCurrentTimeBetween(validatedTime1, validatedTime2, this.currentTime);
      this.log(`Returning ${result} in time-is-between flow with time1 ${args.Time1}(${validatedTime1}), time2 ${args.Time2}(${validatedTime2}) and the time is now ${this.currentTime}`);
      return result;
    })

    this.homey.flow.getTriggerCard('time-is').registerRunListener(async (args, _state) => {
      const validatedTime = this.validateAndGetTime(args.Time.toString());
      if (validatedTime === null) {
        this.error(`Incorrect format (${args.Time}) in trigger flow card: 'time-is'`);
      }
      if (validatedTime === this.currentTime) this.log(`Triggering time-is flow with time ${args.Time}(${validatedTime}) since the time is now ${this.currentTime}`);
      return validatedTime === this.currentTime;
    });
  }

  tick() {
    if (this.formatter !== null) {
      const timeParts = this.formatter.formatToParts(new Date()); // Always UTC
      const hour = timeParts.find(part => part.type === 'hour')?.value;
      const minute = timeParts.find(part => part.type === 'minute')?.value;
      this.currentTime = `${hour}:${minute}`;
      if (this.currentTime !== this.previousTime) {
        this.homey.flow.getTriggerCard('time-is')
          .trigger()
          .catch(this.error);
      }
      this.previousTime = this.currentTime;
    }
  }
}

module.exports = Timey;
export default Timey;
