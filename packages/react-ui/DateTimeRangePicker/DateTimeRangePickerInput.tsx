import { TextField } from "@mui/material";
import { endOfDay, format, isSameMinute, isSameSecond, startOfDay } from "date-fns";
import type { ComponentProps, MouseEventHandler } from "react";

export type DateTimeRangePickerInputProps = Omit<
  ComponentProps<typeof TextField>,
  "onClick" | "value" | "title" | "onChange"
> & {
  start: Date;
  end: Date;
  hideTime?: boolean;
  useSeconds?: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
};

export function DateTimeRangePickerInput({
  start,
  end,
  hideTime,
  useSeconds,
  onClick,
  ...rest
}: DateTimeRangePickerInputProps) {
  const compareFn = useSeconds ? isSameSecond : isSameMinute;

  const startValueStringFormat =
    hideTime || compareFn(startOfDay(start), start) ? "dd.MM.yyyy." : "dd.MM.yyyy. HH:mm";
  const endValueStringFormat =
    hideTime || compareFn(endOfDay(end), end) ? "dd.MM.yyyy." : "dd.MM.yyyy. HH:mm";
  const valueString = `${format(start, startValueStringFormat)} do ${format(end, endValueStringFormat)}`;

  return <TextField onClick={onClick} value={valueString} title={valueString} {...rest} />;
}
