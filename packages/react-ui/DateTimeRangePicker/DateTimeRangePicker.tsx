import { Button, Grid, Popover, TextField, useMediaQuery, type Theme } from '@mui/material';
import { ComponentProps, MouseEvent, useEffect, useMemo, useState } from 'react';
import { StaticDateRangePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFnsV3';
import { hr } from 'date-fns/locale/hr';
import { parse, format, isSameDay, startOfDay, endOfDay, startOfYesterday, endOfYesterday, sub, startOfMonth, endOfMonth, intervalToDuration, Duration } from 'date-fns';
import { TimeInput } from '../TimeInput';
import { DateTimeRangePickerInput } from './DateTimeRangePickerInput';
import { Stack } from '@mui/system';

// TODO: Test cases
//       - Test if start date format shows only date when time is 00:00
//       - Test if end date format shows only date when time is 23:59
//       - Test if start date and start time is combined correctly (without time-zone offsets)
//       - Test if end date and end time is combined correctly (without time-zone offsets)

function durationGetTime(duration: Duration) {
  return (typeof duration.years !== 'undefined' ? duration.years * 365 * 24 * 60 * 60 * 1000 : 0) +
    (typeof duration.months !== 'undefined' ? duration.months * 30 * 24 * 60 * 60 * 1000 : 0) +
    (typeof duration.weeks !== 'undefined' ? duration.weeks * 7 * 24 * 60 * 60 * 1000 : 0) +
    (typeof duration.days !== 'undefined' ? duration.days * 24 * 60 * 60 * 1000 : 0) +
    (typeof duration.hours !== 'undefined' ? duration.hours * 60 * 60 * 1000 : 0) +
    (typeof duration.minutes !== 'undefined' ? duration.minutes * 60 * 1000 : 0) +
    (typeof duration.seconds !== 'undefined' ? duration.seconds * 1000 : 0);
}

/**
 * The date time range picker preselect option.
 * @public
 */
export type DateTimeRangePickerPreselectOption = {
  name: string,
  startDate: Date,
  endDate: Date
};

/**
 * The date time range picker props.
 * @public
 */
export type DateTimeRangePickerProps = Omit<ComponentProps<typeof TextField>, "onClick" | "value" | "title" | "onChange"> & {
  start: Date;
  end: Date;
  hideTime?: boolean;
  useSeconds?: boolean;
  dense?: boolean;
  preselectOptions?: DateTimeRangePickerPreselectOption[];
  onChange: (startDate: Date, endDate: Date) => void;
};

/**
* The date time range picker.
*
* @param props - The props;
* @returns Returns date time range picker component.
* @public
*/
export function DateTimeRangePicker({
  start,
  end,
  hideTime,
  useSeconds,
  preselectOptions,
  onChange,
  ...rest
}: DateTimeRangePickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [startTime, setStartTime] = useState(format(start, 'HH:mm'));
  const [endTime, setEndTime] = useState(format(end, 'HH:mm'));

  // Use js dates because we use date-fns adapter
  const defaultStartDate = startOfDay(start);
  const defaultEndDate = startOfDay(end);

  const [dateValue, setDateValue] = useState<[Date | null, Date | null]>([defaultStartDate, defaultEndDate]);
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

  // Reset cached value when props change (only when not in popover)
  useEffect(() => {
    if (!anchorEl) {
      setDateValue([defaultStartDate, defaultEndDate]);
    }
  }, [start, end]);

  /**
   * Handles the picker input click.
   * This will open picker popover.
   *
   * @param event - The click event
   */
  const handleOpen = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Handles the picker close.
   * This will close the picker and reset selection.
   */
  const handleClose = () => {
    setAnchorEl(null);
    setDateValue([defaultStartDate, defaultEndDate]);
    setStartTime(format(start, 'HH:mm'));
    setEndTime(format(end, 'HH:mm'));
  };

  /**
   * Combines the date and time into Date objects.
   *
   * @returns First element is start date and time, seconds is end date and time.
   */
  const combineDateAndTime = () => {
    if (dateValue[0] == null || dateValue[1] == null)
      return [];

    let startDurationTime = durationGetTime(intervalToDuration({ start: startOfDay(new Date()), end: parse(startTime, "HH:mm", new Date()) }));
    const endDurationTime = durationGetTime(intervalToDuration({ start: startOfDay(new Date()), end: parse(endTime, "HH:mm", new Date()) }));

    // Check if start is after end - set equal
    if (dateValue[0] != null
      && dateValue[1] != null
      && isSameDay(dateValue[0], dateValue[1])
      && startDurationTime > endDurationTime) {
      startDurationTime = endDurationTime;
    }

    const startDateTime = dateValue[0] ? startOfDay(dateValue[0]) : undefined;
    if (startDateTime != null) {
      startDateTime.setMilliseconds(startDateTime.getMilliseconds() + startDurationTime);
    }
    const endDateTime = dateValue[1] ? startOfDay(dateValue[1]) : undefined;
    if (endDateTime != null) {
      endDateTime.setMilliseconds(endDateTime.getMilliseconds() + endDurationTime);
    }
    return [startDateTime, endDateTime];
  };

  /**
   * Handles the picker accept option.
   */
  const handleAccept = () => {
    const combined = combineDateAndTime();
    if (combined[0] != null && combined[1] != null) {
      onChange(combined[0], combined[1]);
      setAnchorEl(null);
    }
  };

  /**
   * Handle the preselect option click.
   * This will set start and end date to preselected values.
   *
   * @param startDate The start date and time.
   * @param endDate The end date and time.
   */
  const handlePreselect = (startDate: Date, endDate: Date) => {
    setDateValue([startDate, endDate]);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const preselectedOptionsOrDefault: { name: string, startDate: Date, endDate: Date }[] = useMemo(() => {
    if (preselectOptions)
      return preselectOptions;

    return [
      { name: 'Danas', startDate: startOfDay(new Date()), endDate: endOfDay(new Date()) },
      { name: 'Jučer', startDate: startOfYesterday(), endDate: endOfYesterday() },
      { name: 'Proteklih 7 dana', startDate: sub(startOfDay(new Date()), { days: 7 }), endDate: endOfDay(new Date()) },
      { name: 'Proteklih 30 dana', startDate: sub(startOfDay(new Date()), { days: 30 }), endDate: endOfDay(new Date()) },
      { name: 'Ovaj mjesec', startDate: startOfMonth(new Date()), endDate: endOfDay(new Date()) },
      { name: 'Prošli mjesec', startDate: sub(startOfMonth(new Date()), { months: 1 }), endDate: endOfMonth(sub(startOfMonth(new Date()), { months: 1 })) }
    ];
  }, [preselectOptions]);

  return (
    <>
      <DateTimeRangePickerInput onClick={handleOpen} start={start} end={end} hideTime={hideTime} useSeconds={useSeconds} {...rest} />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Grid
          container
          sx={{
            maxWidth: { md: '840px' },
            maxHeight: { md: '496px' },
            overflow: { md: 'hidden' },
            flexDirection: { md: 'row', lg: 'column' }
          }}
          justifyContent="center"
        >
          <Grid size={{ xs: 12, md: 3 }}>
            <Stack spacing={1} sx={{ p: 2 }}>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" fullWidth onClick={handleAccept}>Potvrdi</Button>
                <Button variant="text" fullWidth onClick={handleClose}>Odustani</Button>
              </Stack>
              {preselectedOptionsOrDefault.map((opt) => (
                <Button
                  key={opt.name}
                  variant="outlined"
                  fullWidth
                  title={`${opt.startDate} ${opt.endDate}`}
                  onClick={() => handlePreselect(opt.startDate, opt.endDate)}
                >
                  {opt.name}
                </Button>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 9 }} sx={{ maxWidth: '662px', overflow: 'hidden' }}>
            <Stack justifyContent="center">
              <Stack direction="row" spacing={1} sx={{ p: 2, pb: 1 }}>
                <TextField
                  type="date"
                  value={dateValue[0] ? format(dateValue[0], 'yyyy-MM-dd') : ''}
                  onChange={(e) => setDateValue([new Date(e.target.value), dateValue[1]])}
                  fullWidth
                  size="small"
                  label="Od"
                />
                <TextField
                  type="date"
                  value={dateValue[1] ? format(dateValue[1], 'yyyy-MM-dd') : ''}
                  onChange={(e) => setDateValue([dateValue[0], new Date(e.target.value)])}
                  fullWidth
                  size="small"
                  label="Do"
                />
              </Stack>
              {!hideTime && (
                <Stack direction="row" spacing={1} sx={{ pb: 2, px: 2 }}>
                  <TimeInput
                    value={startTime}
                    onTimeChange={setStartTime}
                    useSeconds={useSeconds}
                    size="small"
                    fullWidth />
                  <TimeInput
                    value={endTime}
                    onTimeChange={setEndTime}
                    useSeconds={useSeconds}
                    size="small"
                    fullWidth />
                </Stack>
              )}
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={hr}>
                <StaticDateRangePicker
                  value={dateValue}
                  onChange={setDateValue}
                  disableFuture
                  displayStaticWrapperAs="desktop"
                  calendars={isDesktop ? 2 : 1}
                  // renderInput={(startProps, endProps) => (
                  //   <Stack direction="row" spacing={2}>
                  //     <TextField {...startProps} variant="standard" />
                  //     <TextField {...endProps} variant="standard" />
                  //   </Stack>
                  // )}
                />
              </LocalizationProvider>
            </Stack>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
};
