
export function timeToMinutes(time: string) {
    const [hour, minute] = time.split(':').map(Number);
    return hour * 60 + minute;
}

export function isCurrentTimeBetween(startTime: string, endTime: string, currentTime: string) {
    const current = timeToMinutes(currentTime);
    let start = timeToMinutes(startTime);
    let end = timeToMinutes(endTime);

    // If current time is before end time, assume it's after midnight, treat end time as next day
    if (end < start) {
        if (current < end) {
            start -= 24 * 60; // Move start time to the previous day
        } else {
            end += 24 * 60; // Move end time to the next day
        }
    }
    return current >= start && current < end;
}

export function isEarlierThan(time: string, currentTime: string) {
    const totalMinutes1 = timeToMinutes(time);
    const totalMinutes2 = timeToMinutes(currentTime);
    return totalMinutes1 > totalMinutes2;
}

export function isLaterThan(time: string, currentTime: string) {
    const totalMinutes1 = timeToMinutes(time);
    const totalMinutes2 = timeToMinutes(currentTime);
    return totalMinutes1 < totalMinutes2
}

export function convertToHHmm(time: string) {
    const [hours, fraction] = time.split('.').map(Number);

    const truncated = fraction.toString().padEnd(2, '0').slice(0, 2);
    const minutes = ((Number(truncated) / 100) * 60);

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}
