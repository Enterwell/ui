## API Report File for "@enterwell/react-mui-hooks"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { ComponentPropsWithRef } from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { GridColDef } from '@mui/x-data-grid-pro';
import { GridColumnVisibilityModel } from '@mui/x-data-grid-pro';
import { GridSortModel } from '@mui/x-data-grid-pro';
import { GridValidRowModel } from '@mui/x-data-grid-pro';

// @public
export function useDataGrid({ tableId, pageSize, columns, columnVisibilityModel, defaultSort, renderCell, onPage, onRowClick, rowHeight, selection, checkboxSelection, infiniteLoading, keepNonExistentRowsSelected }: UseDataGridProps): UseDataGridResponse;

// @public
export type UseDataGridProps = {
    columns: ExtendedGridColDef[];
    onPage: (page: number, sortModel?: GridSortModel) => Promise<{
        rows: GridValidRowModel[];
        totalRowsCount?: number;
    }>;
    tableId?: string;
    pageSize?: number;
    columnVisibilityModel?: GridColumnVisibilityModel;
    defaultSort?: GridSortModel;
    renderCell?: (params: any) => React.ReactElement;
    onRowClick?: any;
    rowHeight?: number;
    selection?: boolean;
    checkboxSelection?: boolean;
    infiniteLoading?: boolean;
    keepNonExistentRowsSelected?: boolean;
};

// @public
export type UseDataGridResponse = {
    props: ComponentPropsWithRef<typeof DataGridPro>;
    filterChanged: (keepPage?: boolean) => void;
    isSelectAll: boolean;
    setIsSelectAll: (value: boolean) => void;
    isAnySelected: boolean;
};

// Warnings were encountered during analysis:
//
// dist/index.d.ts:19:5 - (ae-forgotten-export) The symbol "ExtendedGridColDef" needs to be exported by the entry point index.d.ts

// (No @packageDocumentation comment for this package)

```