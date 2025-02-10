import { DatePicker as MuiDatePicker, type DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { TextField, type TextFieldProps } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import hr from 'date-fns/locale/hr';
import { FocusEvent } from 'react';

/**
 * DatePicker props
 * @public
 */
export type DatePickerProps = Omit<MuiDatePickerProps<Date, false>, "renderInput"> & {
  helperText?: string;
  error?: boolean;
  required?: boolean;
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  renderInput?: (params: TextFieldProps) => JSX.Element;
};

/**
 * Date picker component
 * @param props - The props
 * @returns The DatePicker component
 * @public
 */
export function DatePicker({
  onBlur,
  helperText,
  error,
  required,
  format = "dd.MM.yyyy.",
  renderInput,
  ...rest
}: DatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={hr}>
      <MuiDatePicker
        format={format}
        slots={{
          field: renderInput ?? ((params) => (
            <TextField
              error={error}
              helperText={helperText}
              required={required}
              onBlur={onBlur}
              {...params}
            />
          ))
        }}
        {...rest}
      />
    </LocalizationProvider>
  );
}
