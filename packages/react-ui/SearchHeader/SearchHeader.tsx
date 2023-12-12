import React, { type MouseEvent } from 'react';
import {
    Typography, Stack, IconButton, InputBase, useTheme, type TypographyProps
} from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import { Search, Clear } from '@mui/icons-material';

/**
 * The SearchHeader component props.
 * @public
 */
export type SearchHeaderProps = TypographyProps & {
    onSubmit?: (searchTerm: string) => void,
    placeholder: string
}

/**
 * Search header.
 * @param props - The props of the component.
 * @returns The search header component.
 * @public
 */
export function SearchHeader({
    onSubmit,
    placeholder,
    children,
    variant = 'h1',
    ...rest
}: SearchHeaderProps) {
    const [isSearching, setIsSearching] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    const theme = useTheme();
    console.log("theme.", theme.typography)
    const handleSearchClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsSearching(true);
    };

    const handleClearClick = (e: MouseEvent) => {
        e.stopPropagation();
        setSearchTerm('');
        setIsSearching(false);
        if (onSubmit)
            onSubmit('');
    };

    const handleInputBlur = () => {
        if (searchTerm === '') {
            setIsSearching(false);
            if (onSubmit)
                onSubmit('');
        }
    };

    const handleSubmit = (e: any) => {
        if (e.key === 'Enter' && onSubmit) {
            onSubmit(searchTerm);
        } else if (e.key === 'Escape') {
            handleClearClick(e);
        }
    };

    const fontSize = variant ? theme.typography[variant as Variant].fontSize : undefined;

    return isSearching ? (
        <InputBase
            startAdornment={(
                <IconButton onClick={handleClearClick}>
                    <Clear color="primary" sx={{ fontSize: fontSize }} />
                </IconButton>
            )}
            autoFocus
            placeholder={placeholder}
            onClick={(e) => e.stopPropagation()}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSubmit}
            onBlur={handleInputBlur}
            sx={{
                fontSize: fontSize
            }}
        />
    ) : (
        <Stack spacing={1} direction="row" alignItems="center">
            <Typography variant={variant} {...rest}>{children}</Typography>
            {onSubmit && (
                <IconButton onClick={handleSearchClick}>
                    <Search sx={{ fontSize: fontSize }} />
                </IconButton>
            )}
        </Stack>
    );
}
