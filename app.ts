'use strict';

import Homey from 'homey';
import { timeToMinutes, isCurrentTimeBetween, isEarlierThan, isLaterThan } from './lib/time';

class Timey extends Homey.App {

  previousTime = '';
  currentTime = '';
  timeZone: string = '';
  formatter: Intl.DateTimeFormat | null = null;

  HHmm = new RegExp(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);

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
      hour12: false, // Use 24-hour format
    });
    this.log('Timey has been initialized');
    this.homey.setInterval(() => {
      this.tick();
    }, 1000);
  }

  async initFlows() {
    this.homey.flow.getConditionCard('time-is-earlier-than').registerRunListener(async (args, _state) => {
      const time = args.Time.trim();
      if (!this.HHmm.test(time)) {
        this.error(`Incorrect format (${time}) in condition flow card: 'time-is-earlier-than'`);
        throw this.homey.__("wrong-format", { input: time });
      }
      const result = isEarlierThan(time, this.currentTime);
      this.log(`Returning ${result} in time-is-earlier-than flow with time ${time} and the time is now ${this.currentTime}`);
      return result;
    })

    this.homey.flow.getConditionCard('time-is-later-than').registerRunListener(async (args, _state) => {
      const time = args.Time.trim();
      if (!this.HHmm.test(time)) {
        this.error(`Incorrect format (${time}) in condition flow card: 'time-is-later-than'`);
        throw this.homey.__("wrong-format", { input: time });
      }
      const result = isLaterThan(time, this.currentTime);
      this.log(`Returning ${result} in time-is-later-than flow with time ${time} and the time is now ${this.currentTime}`);
      return result;
    })

    this.homey.flow.getConditionCard('time-is-between').registerRunListener(async (args, _state) => {
      const time1 = args.Time1.trim();
      const time2 = args.Time2.trim();
      if (!this.HHmm.test(time1) || !this.HHmm.test(time2)) {
        const wrong = !this.HHmm.test(time1) ? time1 : time2;
        this.error(`Incorrect format (${wrong}) in condition flow card: 'time-is-between'`);
        throw this.homey.__("wrong-format", { input: wrong });
      }
      const result = isCurrentTimeBetween(time1, time2, this.currentTime);
      this.log(`Returning ${result} in time-is-between flow with time1 ${time1}, time2 ${time2} and the time is now ${this.currentTime}`);
      return result;
    })

    this.homey.flow.getTriggerCard('time-is').registerRunListener(async (args, _state) => {
      const time = args.Time.trim();
      if (!this.HHmm.test(time)) {
        this.error(`Incorrect format (${time}) in trigger flow card: 'time-is'`);
      }
      if (time === this.currentTime) this.log(`Triggering time-is flow with time ${time} since the time is now ${this.currentTime}`);
      return time === this.currentTime;
    });
  }

  tick() {
    if (this.formatter !== null) {
      const timeParts = this.formatter.formatToParts(new Date());
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
