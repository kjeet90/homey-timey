import { vi, expect, it, describe, beforeEach } from 'vitest';
import Timey from './app';

const flowTriggerValues: { [index: string]: any[] } = {};

const clearFlowTriggerValues = () => {
    Object.keys(flowTriggerValues).forEach((k) => delete flowTriggerValues[k]);
};

vi.mock('homey', () => {
    const App = vi.fn();
    const Homey = { App };

    App.prototype.homey = {
        flow: {
            getConditionCard: vi.fn().mockImplementation((flowCard: string) => {
                return {
                    registerRunListener: vi.fn()
                }
            }),
            getTriggerCard: vi.fn().mockImplementation((flowCard: string) => {
                return {
                    registerRunListener: vi.fn(),
                    trigger: vi.fn().mockImplementation((args) => {
                        return new Promise<void>((resolve, _reject) => {
                            if (!flowTriggerValues[flowCard]) flowTriggerValues[flowCard] = [args];
                            else flowTriggerValues[flowCard].push(args);
                            resolve();
                        });
                    })
                }

            })
        },
        clock: {
            getTimezone: vi.fn().mockImplementation((cb) => 'Europe/Oslo')
        },
        setInterval: vi.fn().mockImplementation((cb, ms) => {
            return setInterval(cb, ms);
        })

    };

    App.prototype.log = vi.fn().mockImplementation((msg: string) => console.log('MOCK LOGGER:', msg))


    return { default: Homey }
});

beforeEach(() => {
    clearFlowTriggerValues();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-10-12T10:00:00.000Z'));
});

// TODO: Increase test coverage.
describe('Timey', () => {
    it('should be defined', () => {
        const unit = new Timey();
        expect(unit).toBeDefined();
    });



    describe('regex', () => {

        describe('valid', () => {
            it('should accept 00:00', () => {
                const unit = new Timey();
                expect(unit.HHmm.test('00:00')).toBe(true);
            })

            it('should accept 01:00', () => {
                const unit = new Timey();
                expect(unit.HHmm.test('01:00')).toBe(true);
            })
            it('should accept 05:30', () => {
                const unit = new Timey();
                expect(unit.HHmm.test('05:30')).toBe(true);
            })

            it('should accept 12:45', () => {
                const unit = new Timey();
                expect(unit.HHmm.test('12:45')).toBe(true);
            })

            it('should accept 23:59', () => {
                const unit = new Timey();
                expect(unit.HHmm.test('00:00')).toBe(true);
            })

            it('should accept 10:15', () => {
                const unit = new Timey();
                expect(unit.HHmm.test('10:15')).toBe(true);
            })

            it('should accept 02:05', () => {
                const unit = new Timey();
                expect(unit.HHmm.test('02:05')).toBe(true);
            })

            it('should accept 9:05', () => {
                const unit = new Timey();
                expect(unit.HHmm.test('9:05')).toBe(true);
            })
        });

        describe('invalid', () => {
            it('should not accept 24:00', () => {
                const unit = new Timey();
                expect(unit.HHmm.test('24:00')).toBe(false);
            })

            it('should not accept 12:60', () => {
                const unit = new Timey();
                expect(unit.HHmm.test('12:60')).toBe(false);
            })

            it('should not accept 25:10', () => {
                const unit = new Timey();
                expect(unit.HHmm.test('25:10')).toBe(false);
            })

            it('should not accept 00:61', () => {
                const unit = new Timey();
                expect(unit.HHmm.test('00:61')).toBe(false);
            })

            it('should not accept 23:60', () => {
                const unit = new Timey();
                expect(unit.HHmm.test('23:60')).toBe(false);
            })

            it('should not accept 01:100', () => {
                const unit = new Timey();
                expect(unit.HHmm.test('01:100')).toBe(false);
            })

            it('should not accept ab:30', () => {
                const unit = new Timey();
                expect(unit.HHmm.test('ab:30')).toBe(false);
            })

            it('should not accept 23:cd', () => {
                const unit = new Timey();
                expect(unit.HHmm.test('23:cd')).toBe(false);
            })

            it('should not accept 15:45:20', () => {
                const unit = new Timey();
                expect(unit.HHmm.test('15:45:20')).toBe(false);
            })

            it('should not accept 15:4', () => {
                const unit = new Timey();
                expect(unit.HHmm.test('15:4')).toBe(false);
            })
        });


    });

    // FIXME: Async testing not trusted.
    describe('tick', () => {
        it('should run on 1 second interval and call trigger on first time change (app startup). Then not until a new minute has started', async () => {
            clearFlowTriggerValues();
            vi.setSystemTime(new Date('2024-10-12T10:00:57.000Z'));

            const unit = new Timey();
            const tickSpy = vi.spyOn(unit, 'tick');
            await unit.onInit();

            expect(flowTriggerValues).toEqual({});

            vi.advanceTimersByTime(1000); // 10:00:58
            expect(tickSpy).toHaveBeenCalledTimes(1);
            expect(flowTriggerValues).toEqual({ 'time-is': [undefined] });

            vi.advanceTimersByTime(1000); // 10:00:59
            expect(tickSpy).toHaveBeenCalledTimes(2);
            expect(unit.currentTime).toBe('12:00');
            expect(flowTriggerValues).toEqual({ 'time-is': [undefined] });

            vi.advanceTimersByTime(1000); // 10:01:00
            expect(tickSpy).toHaveBeenCalledTimes(3);
            expect(unit.currentTime).toBe('12:01');
            expect(flowTriggerValues).toEqual({ 'time-is': [undefined, undefined] });
        });

        it('should set current time to 00:55 when system time is 22:55 and timeZone is Euroe/Oslo', async () => {
            vi.setSystemTime(new Date('2024-10-12T22:55:00.000Z'));
            const unit = new Timey();
            await unit.onInit();
            unit.tick();
            expect(unit.currentTime).toBe('00:55');
        })

        it('should set current time to 01:00 when system time is 23:00 and timeZone is Euroe/Oslo', async () => {
            vi.setSystemTime(new Date('2024-10-12T23:00:00.000Z'));
            const unit = new Timey();
            await unit.onInit();
            unit.tick();
            expect(unit.currentTime).toBe('01:00');
        })

        it('should set current time to 18:52 when system time is 16:52 and timeZone is Euroe/Oslo', async () => {
            vi.setSystemTime(new Date('2024-10-12T16:52:21.855Z'));
            const unit = new Timey();
            await unit.onInit();
            unit.tick();
            expect(unit.currentTime).toBe('18:52');
        })
    })
});