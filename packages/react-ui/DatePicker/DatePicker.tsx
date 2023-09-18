import { DatePicker as MuiDatePicker, type DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import hr from 'date-fns/locale/hr';
import { FocusEvent } from 'react';

/**
 * DatePicker props
 * @public
 */
export type DatePickerProps = Omit<MuiDatePickerProps<Date, Date>, "renderInput"> & {
  helperText?: string;
  error?: boolean;
  required?: boolean;
  displayDateFormat?: string;
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChange?: (date: Date | null, keyboardInputValue?: string | undefined) => void;
};

/**
 * Date picker component
 * @param props - The props
 * @returns The DatePicker component
 * @public
 */
export function DatePicker({
  onChange,
  onBlur,
  helperText,
  error,
  required,
  displayDateFormat = "dd.MM.yyyy.",
  ...rest
}: DatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={hr}>
      <MuiDatePicker
        inputFormat={displayDateFormat}
        onChange={(date, keyboardInputValue) => onChange(date, keyboardInputValue)}
        InputProps={{
          onBlur
        }}
        renderInput={(params) => (
          <TextField
            error={error}
            helperText={helperText}
            required={required}
            {...params}
          />
        )}
        {...rest}
      />
    </LocalizationProvider>
  );
}
