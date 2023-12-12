import React, { type MouseEvent } from 'react';
import {
    Typography, Stack, IconButton, InputBase, type TypographyProps
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export type SearchHeaderProps = TypographyProps & {
    onSubmit?: (searchTerm: string) => void,
}

/**
 * Search header.
 * @param props The props of the component.
 * @returns The search header component.
 */
export default function SearchHeader({
    onSubmit,
    children,
    ...rest
}: SearchHeaderProps) {
    const [isSearching, setIsSearching] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

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

    return isSearching ? (
        <InputBase
            startAdornment={(
                <IconButton onClick={handleClearClick}>
                    <ClearIcon color="primary" />
                </IconButton>
            )}
            autoFocus
            placeholder="Pretraži po pojmu"
            onClick={(e) => e.stopPropagation()}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSubmit}
            onBlur={handleInputBlur}
            sx={{
                fontSize: 16,
            }}
        />
    ) : (
        <Stack spacing={1} direction="row" alignItems="center">
            <Typography variant="h1" {...rest}>{children}</Typography>
            {onSubmit && (
                <IconButton size="small" onClick={handleSearchClick}>
                    <SearchIcon />
                </IconButton>
            )}
        </Stack>
    );
}
