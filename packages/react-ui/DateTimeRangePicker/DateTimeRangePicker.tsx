import {
  Box, Button, Grid, Popover, TextField, useTheme, useMediaQuery
} from '@mui/material';
import { ComponentProps, MouseEvent, useState } from 'react';
import { StaticDateRangePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import moment, { type Moment } from 'moment';
import hrLocale from 'date-fns/locale/hr';
import { TimeInput } from '../TimeInput';

/**
 * The date time range picker props.
 * @public
 */
export type DateTimeRangePickerProps = Omit<ComponentProps<typeof TextField>, "onClick" | "value" | "title"> & {
  start: Moment;
  end: Moment;
  onChange: (startDate: Moment, endDate: Moment) => void;
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
  const [startTime, setStartTime] = useState(moment(propStartDate).format('HH:mm'));
  const [endTime, setEndTime] = useState(propEndDate.format('HH:mm'));

  // Use js dates because we use date-fns adapter
  const defaultStartDate = moment(propStartDate).startOf('day').toDate();
  const defaultEndDate = moment(propEndDate).startOf('day').toDate();

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
   * This will close the picker.
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Combines the date and time into.
   *
   * @returns First element is start date and time, seconds is end date and time.
   */
  const combineDateAndTime = () => {
    let startDuration = moment.duration(startTime);
    const endDuration = moment.duration(endTime);

    // Check if start is after end - set equal
    if (moment(dateValue[0]).startOf('day').isSame(moment(dateValue[1]).startOf('day'))
      && startDuration.asMilliseconds() > endDuration.asMilliseconds()) {
      startDuration = endDuration;
    }

    const startDateTime = moment(dateValue[0]).startOf('day');
    const endDateTime = moment(dateValue[1]).startOf('day');
    startDateTime.add(startDuration.asMilliseconds(), 'ms');
    endDateTime.add(endDuration.asMilliseconds(), 'ms');
    return [startDateTime, endDateTime];
  };

  /**
   * Handles the picker accept option.
   */
  const handleAccept = () => {
    const combined = combineDateAndTime();
    onChange(combined[0], combined[1]);
    handleClose();
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

  const preselectedOptions = [
    { name: 'Danas', startDate: moment().startOf('day'), endDate: moment().endOf('day') },
    { name: 'Jučer', startDate: moment().subtract(1, 'days').startOf('day'), endDate: moment().subtract(1, 'days').endOf('day') },
    { name: 'Proteklih 7 dana', startDate: moment().subtract(7, 'days').startOf('day'), endDate: moment().endOf('day') },
    { name: 'Proteklih 30 dana', startDate: moment().subtract(30, 'days').startOf('day'), endDate: moment().endOf('day') },
    { name: 'Ovaj mjesec', startDate: moment().startOf('month'), endDate: moment().endOf('day') },
    { name: 'Prošli mjesec', startDate: moment().subtract(1, 'months').startOf('month'), endDate: moment().subtract(1, 'months').endOf('month') }
  ];

  const startValueStringFormat = hideTime || moment(propStartDate).startOf('day').isSame(propStartDate, 'minute')
    ? 'DD.MM.YYYY.'
    : 'DD.MM.YYYY. HH:mm';
  const endValueStringFormat = hideTime || moment(propEndDate).endOf('day').isSame(propEndDate, 'minute')
    ? 'DD.MM.YYYY.'
    : 'DD.MM.YYYY. HH:mm';
  const valueString = `${moment(propStartDate).format(startValueStringFormat)} do ${moment(propEndDate).format(endValueStringFormat)}`;

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
                      onClick={() => handlePreselect(opt.startDate.toDate(), opt.endDate.toDate())}
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
                            value={moment(dateValue[0]).format('YYYY-MM-DD')}
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
                            value={moment(dateValue[1]).format('YYYY-MM-DD')}
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
