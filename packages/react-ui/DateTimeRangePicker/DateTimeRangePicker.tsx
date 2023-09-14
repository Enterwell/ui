import {
  Box, Button, Grid, Popover, TextField, useTheme, useMediaQuery
} from '@mui/material';
import { ComponentProps, MouseEvent, useState } from 'react';
import { StaticDateRangePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import hrLocale from 'date-fns/locale/hr';
import { parse, format, isSameDay, isSameMinute, startOfDay, endOfDay, startOfYesterday, endOfYesterday, sub, startOfMonth, endOfMonth } from 'date-fns';
import { TimeInput } from '../TimeInput';

/**
 * The date time range picker props.
 * @public
 */
export type DateTimeRangePickerProps = Omit<ComponentProps<typeof TextField>, "onClick" | "value" | "title" | "onChange"> & {
  start: Date;
  end: Date;
  onChange: (startDate: Date, endDate: Date) => void;
  hideTime?: boolean;
  dense?: boolean;
};

/**
* The date time range picker.
*
* @param props - The props;
* @returns Returns date time range picker component.
* @public
*/
export function DateTimeRangePicker({
  start: propStartDate,
  end: propEndDate,
  hideTime,
  onChange,
  ...rest
}: DateTimeRangePickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [startTime, setStartTime] = useState(format(propStartDate, 'HH:mm'));
  const [endTime, setEndTime] = useState(format(propEndDate, 'HH:mm'));

  // Use js dates because we use date-fns adapter
  const defaultStartDate = startOfDay(propStartDate);
  const defaultEndDate = startOfDay(propEndDate);

  const [dateValue, setDateValue] = useState<[Date | null, Date | null]>([defaultStartDate, defaultEndDate]);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

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
    setStartTime(format(propStartDate, 'HH:mm'));
    setEndTime(format(propEndDate, 'HH:mm'));
  };

  /**
   * Combines the date and time into moment objects.
   *
   * @returns First element is start date and time, seconds is end date and time.
   */
  const combineDateAndTime = () => {
    if (dateValue[0] == null || dateValue[1] == null)
      return [];

    let startDuration = parse(startTime, "HH:mm", 0);
    const endDuration = parse(endTime, "HH:mm", 0);

    // Check if start is after end - set equal
    if (dateValue[0] != null
      && dateValue[1] != null
      && isSameDay(dateValue[0], dateValue[1])
      && startDuration.getTime() > endDuration.getTime()) {
      startDuration = endDuration;
    }

    const startDateTime = dateValue[0] ? startOfDay(dateValue[0]) : undefined;
    if (startDateTime != null) {
      startDateTime.setMilliseconds(startDateTime.getMilliseconds() + startDuration.getTime());
    }
    const endDateTime = dateValue[1] ? startOfDay(dateValue[1]) : undefined;
    if (endDateTime != null) {
      endDateTime.setMilliseconds(endDateTime.getMilliseconds() + endDuration.getTime());
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

  const preselectedOptions: { name: string, startDate: Date, endDate: Date }[] = [
    { name: 'Danas', startDate: startOfDay(new Date()), endDate: endOfDay(new Date()) },
    { name: 'Jučer', startDate: startOfYesterday(), endDate: endOfYesterday() },
    { name: 'Proteklih 7 dana', startDate: sub(startOfDay(new Date()), { days: 7 }), endDate: endOfDay(new Date()) },
    { name: 'Proteklih 30 dana', startDate: sub(startOfDay(new Date()), { days: 30 }), endDate: endOfDay(new Date()) },
    { name: 'Ovaj mjesec', startDate: startOfMonth(new Date()), endDate: endOfDay(new Date()) },
    { name: 'Prošli mjesec', startDate: sub(startOfMonth(new Date()), { months: 1 }), endDate: endOfMonth(sub(startOfMonth(new Date()), { months: 1 })) }
  ];

  const startValueStringFormat = hideTime || isSameMinute(startOfDay(propStartDate), propStartDate)
    ? 'dd.MM.yyyy.'
    : 'dd.MM.yyyy. HH:mm';
  const endValueStringFormat = hideTime || isSameMinute(endOfDay(propEndDate), propEndDate)
    ? 'dd.MM.yyyy.'
    : 'dd.MM.yyyy. HH:mm';
  const valueString = `${format(propStartDate, startValueStringFormat)} do ${format(propEndDate, endValueStringFormat)}`;

  return (
    <>
      <TextField onClick={handleOpen} value={valueString} title={valueString} {...rest} />
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
          <Grid item md={3}>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={6}>
                      <Button variant="contained" fullWidth onClick={handleAccept}>Potvrdi</Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button variant="text" fullWidth onClick={handleClose}>Odustani</Button>
                    </Grid>
                  </Grid>
                </Grid>
                {preselectedOptions.map((opt) => (
                  <Grid item key={opt.name} xs={12} sm={4} md={12}>
                    <Button
                      variant="outlined"
                      fullWidth
                      title={`${opt.startDate} ${opt.endDate}`}
                      onClick={() => handlePreselect(opt.startDate, opt.endDate)}
                    >
                      {opt.name}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          <Grid item md={9} sx={{ maxWidth: '662px', overflow: 'hidden' }}>
            <Grid container justifyContent="center">
              {!hideTime && (
                <>
                  <Grid item flexGrow={1}>
                    <Box sx={{ p: 2, pb: 1 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <TextField
                            type="date"
                            value={dateValue[0] ? format(dateValue[0], 'yyyy-MM-dd') : ''}
                            onChange={(e) => setDateValue([e.target.value as unknown as Date, dateValue[1]])}
                            fullWidth
                            size="small"
                            label="Od"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            type="date"
                            value={dateValue[1] ? format(dateValue[1], 'yyyy-MM-dd') : ''}
                            onChange={(e) => setDateValue([dateValue[0], e.target.value as unknown as Date])}
                            fullWidth
                            size="small"
                            label="Do"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item flexGrow={1}>
                    <Box sx={{ pb: 2, px: 2 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <TimeInput value={startTime} onTimeChange={setStartTime} />
                        </Grid>
                        <Grid item xs={6}>
                          <TimeInput value={endTime} onTimeChange={setEndTime} />
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </>
              )}
              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={hrLocale}>
                  <StaticDateRangePicker
                    value={dateValue}
                    onChange={setDateValue}
                    disableFuture
                    displayStaticWrapperAs="desktop"
                    calendars={isDesktop ? 2 : 1}
                    renderInput={(startProps, endProps) => (
                      <>
                        <TextField {...startProps} variant="standard" />
                        <Box sx={{ mx: 2 }}> do </Box>
                        <TextField {...endProps} variant="standard" />
                      </>
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
};
