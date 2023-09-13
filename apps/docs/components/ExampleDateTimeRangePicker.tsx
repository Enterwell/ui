import { DateTimeRangePicker } from '@enterwell/react-ui';
import moment from 'moment';

export function ExampleDateTimeRangePicker() {
    return (
        <DateTimeRangePicker
            start={moment('2023-09-10')}
            end={moment('2023-09-13')}
            onChange={() => {}} />
    )
}