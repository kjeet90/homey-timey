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

describe('convertHmmToHHmm', () => {
    it('should return 10:30 when 10:30 is passed', () => {
        expect(time.convertHmmToHHmm('10:30')).toBe('10:30');
    })

    it('should return 09:30 when 9:30 is passed', () => {
        expect(time.convertHmmToHHmm('9:30')).toBe('09:30');
    })
});

describe('convertDecimalToHHmm', () => {
    it('should return 10:30 when 10.5 is passed', () => {
        expect(time.convertDecimalToHHmm('10.5')).toBe('10:30');
    })

    it('should return 10:30 when 10.50 is passed', () => {
        expect(time.convertDecimalToHHmm('10.50')).toBe('10:30');
    })

    it('should return 22:30 when 22.5 is passed', () => {
        expect(time.convertDecimalToHHmm('22.5')).toBe('22:30');
    })

    it('should return 22:30 when 22.50 is passed', () => {
        expect(time.convertDecimalToHHmm('22.50')).toBe('22:30');
    })

    it('should return 02:15 when 2.25 is passed', () => {
        expect(time.convertDecimalToHHmm('2.25')).toBe('02:15');
    })

    it('should return 02:15 when 2.25000 is passed', () => {
        expect(time.convertDecimalToHHmm('2.25000')).toBe('02:15');
    })

    it('should return 08:45 when 8.75 is passed', () => {
        expect(time.convertDecimalToHHmm('8.75')).toBe('08:45');
    })

    it('should return 08:45 when 8.75000000 is passed', () => {
        expect(time.convertDecimalToHHmm('8.75000000')).toBe('08:45');
    })

    it('should return 08:42 when 8.7 is passed', () => {
        expect(time.convertDecimalToHHmm('8.7')).toBe('08:42');
    })

    it('should return 14:07 when 14.11 is passed', () => {
        expect(time.convertDecimalToHHmm('14.11')).toBe('14:07');
    })

    it('should return 14:12 when 14.02 is passed', () => {
        expect(time.convertDecimalToHHmm('14.02')).toBe('14:12');
    })
})

describe('convertHToHHmm', () => {
    it('should return 10:00 when 10 is passed', () => {
        expect(time.convertHToHHmm('10')).toBe('10:00');
    })

    it('should return 01:00 when 1 is passed', () => {
        expect(time.convertHToHHmm('1')).toBe('01:00');
    })

    it('should return 00:00 when 0 is passed', () => {
        expect(time.convertHToHHmm('0')).toBe('00:00');
    })

    it('should return 23:00 when 23 is passed', () => {
        expect(time.convertHToHHmm('23')).toBe('23:00');
    })
});