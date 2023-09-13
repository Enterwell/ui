import {
  TextField
} from '@mui/material';
import { type ChangeEvent, type ComponentProps, type FocusEvent } from 'react';

function processTime(time: unknown, useSeconds: boolean) {
  const timeMatch = typeof time === 'string' ? time?.match(/\d/g) : null;
  if (timeMatch == null) {
    return '00:00' + (useSeconds ? ':00' : '');
  }

  const timeString = timeMatch.length % 2 === 0
    ? (time as string).toString()
    : '0' + (time as string).toString();
  const startTimeMatch = timeString.match(/(([0-1][0-9]?)|(2[0-3]))?:?(\d\d?)?:?(\d\d?)?/);
  if (!startTimeMatch) {
    return '00:00' + (useSeconds ? ':00' : '');
  }

  let h = Number.parseInt(startTimeMatch[1], 10) || 0;
  let m = Number.parseInt(startTimeMatch[4], 10) || 0;
  let s = Number.parseInt(startTimeMatch[5], 10) || 0;
  m += Math.floor(s / 60);
  s %= 60;
  h += Math.floor(m / 60);
  m %= 60;
  h %= 24;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}${useSeconds && s > 0 ? ':' + s.toString().padStart(2, '0') : ''}`;
}

/**
 * The time input props.
 * @public
 */
export type TimeInputProps = ComponentProps<typeof TextField> & {
  useSeconds?: boolean;
  onTimeChange?: (time: string) => void;
}

/**
* The time input component.
*
* @param props - The props;
* @returns The time input component.
* @public
*/
export function TimeInput({
  value,
  defaultValue,
  useSeconds,
  onChange,
  onBlur,
  onTimeChange,
  ...rest
}: TimeInputProps) {
  /**
   * Handles the input blur.
   * This will call onTimeChange callback.
   */
  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    if (onBlur) {
      onBlur(event);
    }
    if (onTimeChange) {
      onTimeChange(processTime(value ?? defaultValue, useSeconds ?? false));
    }
  };

  /**
   * Handles the input change.
   * This will call onTimeChange callback.
   */
  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (onChange) {
      onChange(event);
    }
    if (onTimeChange) {
      onTimeChange(event.target.value);
    }
  }

  return (
    <TextField
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      onBlur={handleBlur}
      {...rest}
    />
  );
}
