import { it, describe, expect } from 'vitest';
import * as time from './time';

describe('timeToMinutes', () => {
    it('should return 120 when 02:00 is passed', () => {
        expect(time.timeToMinutes('02:00')).toBe(120);
    })

    it('should return 55 when 00:55 is passed', () => {
        expect(time.timeToMinutes('00:55')).toBe(55);
    })

    it('should return 960 when 16:00 is passed', () => {
        expect(time.timeToMinutes('16:00')).toBe(960);
    })
});

describe('isCurrentTimeBetween', () => {

    describe('same day', () => {
        describe('between limits', () => {
            it('should return true when start = 13:00, end = 15:00 and time = 14:00', () => {
                expect(time.isCurrentTimeBetween('13:00', '15:00', '14:00')).toBe(true);
            })

            it('should return false when start = 13:00, end = 15:00 and time = 16:00', () => {
                expect(time.isCurrentTimeBetween('13:00', '15:00', '16:00')).toBe(false);
            })

            it('should return false when start = 13:00, end = 15:00 and time = 12:00', () => {
                expect(time.isCurrentTimeBetween('13:00', '15:00', '12:00')).toBe(false);
            })

            it('should return true when start = 17:29, end = 17:31 and time = 17:30', () => {
                expect(time.isCurrentTimeBetween('17:29', '17:31', '17:30')).toBe(true);
            })
        })

        describe('on limits', () => {
            it('should return true when start = 17:29, end = 17:31 and time = 17:29', () => {
                expect(time.isCurrentTimeBetween('17:29', '17:31', '17:29')).toBe(true);
            })

            it('should return false when start = 17:29, end = 17:31 and time = 17:31', () => {
                expect(time.isCurrentTimeBetween('17:29', '17:31', '17:31')).toBe(false);
            })
        })
    })

    describe('end is next day', () => {
        describe('between limits', () => {
            it('should return true when start = 13:00, end = 12:00 and time is 11:00', () => {
                expect(time.isCurrentTimeBetween('13:00', '12:00', '11:00')).toBe(true);
            })

            it('should return true when start = 13:00, end = 12:00 and time is 18:00', () => {
                expect(time.isCurrentTimeBetween('13:00', '12:00', '18:00')).toBe(true);
            })

            it('should return false when start = 22:00, end = 04:00 and time is 21:00', () => {
                expect(time.isCurrentTimeBetween('22:00', '04:00', '21:00')).toBe(false);
            })

            it('should return true when start = 22:00, end = 04:00 and time = 00:00', () => {
                expect(time.isCurrentTimeBetween('22:00', '04:00', '00:00')).toBe(true);
            })

            it('should return true when start = 22:00, end = 04:00 and time is 00:55', () => {
                expect(time.isCurrentTimeBetween('22:00', '04:00', '00:55')).toBe(true);
            })

            it('should return false when start = 22:00, end = 04:00 and time is 05:00', () => {
                expect(time.isCurrentTimeBetween('22:00', '04:00', '05:00')).toBe(false);
            })
        });

        describe('on limits', () => {
            it('should return true when start = 13:00, end = 12:00 and time = 13:00', () => {
                expect(time.isCurrentTimeBetween('13:00', '12:00', '13:00')).toBe(true);
            })

            it('should return false when start = 13:00, end = 12:00 and time = 12:00', () => {
                expect(time.isCurrentTimeBetween('13:00', '12:00', '12:00')).toBe(false);
            })
        });
    });
});

describe('isEarlierThan', () => {
    it('should return true when time = 13:00 and current time is 12:59', () => {
        expect(time.isEarlierThan('13:00', '12:59')).toBe(true);
    })

    it('should return false when time = 13:00 and current time is 13:00', () => {
        expect(time.isEarlierThan('13:00', '13:00')).toBe(false);
    })

    it('should return false when time = 13:00 and current time is 13:01', () => {
        expect(time.isEarlierThan('13:00', '13:01')).toBe(false);
    })

});

describe('isLaterThan', () => {
    it('should return false when time = 13:00 and current time is 12:59', () => {
        expect(time.isLaterThan('13:00', '12:59')).toBe(false);
    })

    it('should return false when time = 13:00 and current time is 13:00', () => {
        expect(time.isLaterThan('13:00', '13:00')).toBe(false);
    })

    it('should return true when time = 13:00 and current time is 13:01', () => {
        expect(time.isLaterThan('13:00', '13:01')).toBe(true);
    })

});