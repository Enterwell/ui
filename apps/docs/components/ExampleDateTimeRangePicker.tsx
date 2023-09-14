import { DateTimeRangePicker } from '@enterwell/react-ui';
import { useState } from 'react';

export function ExampleDateTimeRangePicker() {
    const [start, setStart] = useState<Date>(new Date(new Date().getTime() - 1000 * 60 * 60 * 24));
    const [end, setEnd] = useState<Date>(new Date());

    return (
        <DateTimeRangePicker
            start={start}
            end={end}
            onChange={(start, end) => { setStart(start); setEnd(end); }} />
    )
}