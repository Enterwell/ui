import { useState, useEffect, KeyboardEvent, SyntheticEvent, FocusEvent, ReactNode } from 'react';
import { Autocomplete, TextField, CircularProgress, ChipTypeMap } from '@mui/material';
import { type AutocompleteProps, createFilterOptions } from '@mui/material/Autocomplete';
import { useDebounce } from '@enterwell/react-hooks';

const ScrollLoadOffset = 100;

/**
 * Produces copy of array without duplicates (value property used for queality comparison).
 *
 * @param array - The input array.
 * @returns Returns new array.
 */
function distinctByValue<T extends { value: any; }>(array: T[]) {
  const a = array.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i].value === a[j].value) a.splice(j--, 1);
    }
  }

  return a;
}

/**
 * The select item.
 * @public
 */
export type SelectItem = {
  value: string;
  label?: string;
};

/**
 * The props for the select component.
 * @param T - The select item.
 * @param ChipComponent - The chip component.
 * @public
 */
export type SelectProps<
  T extends SelectItem,
  ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent']> =
  Omit<AutocompleteProps<T, boolean, false, false, ChipComponent>, "options" | "value" | "onChange" | "renderInput" | "renderOption"> & {
    multiple?: boolean;
    items: T[];
    placeholder?: string;
    selected: T | T[];
    loading?: boolean;
    label?: ReactNode;
    onChange: (event: SyntheticEvent<Element, Event>, value: T[]) => void;
    displayOption?: (option: T) => string;
    pageSize: number;
    onPage?: (text: string | null, page: number, pageSize: number) => void;

    /**
     * Defaults to 200 (ms).
     */
    debounce?: number;
    noOptionsText?: string;
    loadingOptionsText?: string;
    error?: boolean;
    helperText?: string;
    required?: boolean;
    disableFilterOptions?: boolean;
    stopPropagationOnKeyCodeSpace?: boolean;
    onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  };

/**
 * The select component.
 *
 * @param props - The props.
 * @returns Returns the component.
 * @public
 */
export function Select<
  T extends SelectItem,
  ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent']>({
    multiple,
    items,
    placeholder,
    selected,
    loading: parentLoading,
    label,
    onChange,
    displayOption,
    pageSize,
    onPage,
    debounce = 200,
    noOptionsText = 'Nema elemenata',
    loadingOptionsText = 'Učitavanje...',
    error,
    helperText = '',
    required,
    disableFilterOptions,
    stopPropagationOnKeyCodeSpace,
    onBlur,
    ...rest
  }: SelectProps<T, ChipComponent>) {

  // Input text and debounced text are used to more cleanly
  // call an BE for additional data when user changes input.
  const [inputText, setInputText] = useState<string | null>(null);
  const debouncedText = useDebounce(inputText, debounce);

  // Used to display loading icon when calling a callback for new data.
  const [loading, setLoading] = useState(false);

  // When items are loaded, stop displaying loading icon.
  useEffect(() => setLoading(false), [items, pageSize]);

  // Handle the debounced input change.
  // This will request first page from server.
  useEffect(() => {
    if (debouncedText !== null && onPage) {
      onPage(debouncedText, 0, pageSize);
    }
  }, [debouncedText]);

  /**
   * Handle the scroll pagination.
   * When user scroll to end, next page is requested.
   */
  const handleScrollPagination = () => {
    // If there is more pages to load, request next page
    if (items.length % pageSize === 0) {
      setLoading(true);
      if (onPage) {
        onPage(debouncedText, Math.floor(items.length / pageSize), pageSize);
      }
    }
  };

  /**
   * Handles the listbox scroll event.
   * @param event - event
   */
  const handleListboxScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const listboxNode = event.currentTarget;
    const scrollOffset = listboxNode.scrollTop + listboxNode.clientHeight + ScrollLoadOffset;
    if (scrollOffset > listboxNode.scrollHeight) {
      handleScrollPagination();
    }
  }

  /**
   * Handle the dropdown opening.
   * Request initial page.
   */
  const handleOnOpen = () => {
    if (onPage) {
      onPage(debouncedText, 0, pageSize);
    }
  };

  /**
   * Handle the dropwdown closed.
   * Clears the input text.
   * @return {void}
   */
  const handleOnClose = () => {
    setInputText(null);
  };

  /**
   * Handles key down event
   * @param event - event
   */
  const handleOnKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (stopPropagationOnKeyCodeSpace && event.key === ' ') {
      event.stopPropagation();
    }
  };

  // If we passed in selected elements to the component, check if its an array.
  // Because, if its not, it needs to be.
  const defaultValue = Array.isArray(selected) ? selected : [selected];

  // Merges both arrays and gets unique items
  const optionItems = distinctByValue(items.concat(defaultValue))
    .filter(Boolean)
    .map((o) => ({ ...o, text: o.value }));

  // Filter options
  const customFilterOptions = disableFilterOptions
    ? (x: T[]) => x
    : createFilterOptions<T>();

  /**
   * Handles the change event.
   * @param event - The event.
   * @param value - The value.
   */
  const handleChange = (event: SyntheticEvent<Element, Event>, value: T | T[] | null) => {
    if (Array.isArray(value)) {
      return onChange(event, value);
    }

    return onChange(event, value != null ? [value] : []);
  };

  return (
    <Autocomplete<T, boolean, false, false, ChipComponent>
      onOpen={handleOnOpen}
      onClose={handleOnClose}
      onKeyDown={handleOnKeyDown}
      multiple={multiple}
      options={optionItems}
      value={multiple ? defaultValue : defaultValue[0]}
      noOptionsText={
        parentLoading || loading ? loadingOptionsText : noOptionsText
      }
      isOptionEqualToValue={(to, cv) => to?.value === cv?.value}
      // Options should have label property!
      getOptionLabel={(option) => option.label || option.value}
      // Passing only the value to the callback, because we don't really need an event or reason.
      onChange={(e, value) => handleChange(e, value)}
      onInputChange={(_, value) => setInputText(value)}
      renderOption={(params, option) => (
        <li {...params} key={option.value}>
          {displayOption ? displayOption(option) : option.label}
        </li>
      )}
      filterOptions={customFilterOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          required={required}
          helperText={helperText}
          variant="outlined"
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            onBlur,
            endAdornment: (
              <>
                {parentLoading || loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      // A workaround to handle scroll event in the material UI Autocomplete component.
      // GitHub issue to implement a proper pagination onAutocomplete
      // component was opened few days ago.
      ListboxProps={{
        onScroll: handleListboxScroll,
      }}
      {...rest}
    />
  );
}
