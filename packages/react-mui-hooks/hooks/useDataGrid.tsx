import {
    type ComponentPropsWithRef,
    type PropsWithChildren,
    isValidElement,
    useCallback,
    useEffect,
    useMemo,
    useState
} from 'react';
import {
    Button,
    Typography,
    Grid,
    useTheme,
    LinearProgress,
    Theme,
    lighten
} from '@mui/material';
import {
    type GridCallbackDetails,
    type GridColumnVisibilityModel,
    type GridRowSelectionModel,
    type GridCellParams,
    type GridFilterOperator,
    type GridFilterInputValueProps,
    type GridFilterItem,
    type GridColDef,
    type GridTreeNode,
    type MuiEvent,
    type GridSortModel,
    type GridPaginationModel,
    type GridValidRowModel,
    type DataGridPro,
    type GridSortItem,
    type GridLocaleText,
    type GridRowScrollEndParams,
    type GridDensity,
    type UncapitalizedGridProSlotsComponent,
    type GridFilterModel,
    type GridColumnResizeParams,
    type GridPinnedColumns,
    type GridColumnOrderChangeParams,
} from '@mui/x-data-grid-pro';
import { useResizeObserver } from '@enterwell/react-hooks';
import { format } from 'date-fns';
import { Select } from '@enterwell/react-ui';
import { GridProSlotProps } from '@mui/x-data-grid-pro/models/gridProSlotProps';

const DISPLAY_DATETIME_FORMAT = "dd.MM.yyyy. HH:mm:ss";
const DISPLAY_DATE_FORMAT = "dd.MM.yyyy.";
const columnVisibilityLocalStorageKey = 'muidatagrid-columnvisibility';
const columnSizeLocalStorageKey = 'muidatagrid-columnwidth';
const columnPinningLocalStorageKey = 'muidatagrid-columnpinning';
const columnOrderingLocalStorageKey = 'muidatagrid-columnordering';

const dataGridSx = (theme: Theme) => ({
    '& .MuiDataGrid-columnHeader::after': {
        content: '""',
        position: 'absolute',
        right: 0,
        top: 8,
        bottom: 8,
        width: '1px',
        bgcolor: 'divider'
    },
    '& .MuiDataGrid-sortIcon': {
        color: lighten(theme.palette.primary.main, 0.4)
    },
    '& .MuiDataGrid-filterIcon': {
        color: lighten(theme.palette.primary.main, 0.4)
    }
});

/**
 * The text component.
 *
 * @param props - Props
 * @returns The component.
 */
function Text({ children, width, rowHeight }: PropsWithChildren<{ width?: number, rowHeight?: number }>) {
    return (
        <Typography
            title={typeof children === 'string' ? children : undefined}
            noWrap
            component="span"
            style={{
                maxWidth: width,
                minWidth: width,
                lineHeight: `${rowHeight}px`,
                minHeight: `${rowHeight}px`,
                maxHeight: `${rowHeight}px`
            }}
        >
            {children}
        </Typography>
    );
}

// TODO: Allow customization
type CellRendererCustomType = "datetime" | 'enum' | 'actions' | 'date' | 'boolean' | 'html';

type ExtendedGridRenderHeaderParams = Omit<GridCallbackDetails<any>, "colDef"> & {
    colDef: ExtendedGridColDef
};

type ExtendedGridRenderCellParams = Omit<GridCellParams<GridValidRowModel, unknown, unknown, GridTreeNode>, "colDef"> & {
    colDef: ExtendedGridColDef,
    width?: number
};

/**
 * Extended data grid column definition.
 *
 * @public
 */
export type ExtendedGridColDef = GridColDef<GridValidRowModel> & {
    customType?: CellRendererCustomType
    enum?: { get: (value: any) => { label: string } | undefined },
    width?: number
};

/**
 * Type-safe extended data grid column definition.
 *
 * @public
 */
export type TypedExtendedGridColDef<T> = ExtendedGridColDef & {
    field: keyof T
};

/**
 * Type-safe data grid column visibility model
 *
 * @public
 */
export type TypedColVisibilityModel<T> = GridColumnVisibilityModel & {
    [K in keyof Partial<T>]: boolean
};

/**
 * Type-safe sort model
 *
 * @public
 */
export type TypedSortModel<T> = (GridSortItem & {
    field: keyof T
})[];

type CellRendererProps = {
    customType?: CellRendererCustomType,
    value?: any,
    width?: number,
    rowHeight?: number,
    params: ExtendedGridColDef
};

/**
 * The cell renderer.
 *
 * @param props - The props.
 * @returns The cell function component.
 */
function CellRenderer({
    customType,
    value,
    params,
    ...rest
}: CellRendererProps) {
    if (customType === 'datetime') {
        return <Text {...rest}>{format(value, DISPLAY_DATETIME_FORMAT)}</Text>;
    }
    if (customType === 'enum') {
        let enumLabel: string | undefined = '';

        try {
            enumLabel = params.enum?.get(value)?.label;
        } catch { }

        if (enumLabel) {
            return <Text {...rest}>{enumLabel}</Text>;
        }
    }
    if (customType === 'actions') {
        return (
            <Grid container alignItems="center" justifyContent="space-evenly" wrap="nowrap">
                {Object.keys(value).map((key, index) => (
                    <Grid key={key} item>
                        <Button variant={index <= 0 ? 'contained' : 'outlined'} onClick={(e) => value[key](e)}>{key}</Button>
                    </Grid>
                ))}
            </Grid>
        );
    }
    if (customType === 'date') {
        return <Text {...rest}>{value ? format(value, DISPLAY_DATE_FORMAT) : ''}</Text>;
    }
    if (customType === 'boolean') {
        return <Text {...rest}>{value ? 'Da' : 'Ne'}</Text>;
    }
    if (customType === 'html') {
        // eslint-disable-next-line react/no-danger
        return <div dangerouslySetInnerHTML={value} />;
    }
    // TODO: Allow customization (inject custom-cutomTypes)
    if (typeof (value) === 'object' && isValidElement(value)) {
        return value;
    }
    return <Text {...rest}>{typeof value === 'number' || typeof value === 'boolean' || value ? value.toString() : ''}</Text>;
}

/**
 * The boolean filter input.
 * @param props - The props.
 * @returns The component.
 */
function BooleanInputValue(props: GridFilterInputValueProps) {
    const { item, applyValue } = props;

    /**
     * The selected items change handler.
     * @param selectedItems - The selected items.
     */
    const handleChange = (selectedItems: Array<{ value: string }>) => {
        applyValue({ ...item, value: selectedItems[0]?.value });
    };

    const options = [
        { label: 'Da', value: 'true' },
        { label: 'Ne', value: 'false' }
    ];

    return (
        <Select
            label="Vrijednost"
            value={options.filter((x) => x.value === item.value)}
            options={options}
            onChange={(_, value) => handleChange(value)} />
    );
}

const customTypeBooleanOperators: GridFilterOperator[] = [
    {
        label: 'Sadrži',
        value: 'contains',
        getApplyFilterFn: (filterItem: GridFilterItem) => {
            if (!filterItem.field || !filterItem.value || !filterItem.operator) {
                return null;
            }
            return (params): boolean => params.value.toString() === filterItem.value.toString();
        },
        InputComponent: BooleanInputValue,
        InputComponentProps: { type: 'checkbox' },
        getValueAsString: (value) => (value ? 'Da' : 'Ne')
    }
];

/**
 * The custom type operator resolver.
 * @param {object} column The column.
 * @returns {GridFilterOperator[]} The operators.
 */
function resolveCustomTypeOperators(column: ExtendedGridColDef): { filterOperators?: GridFilterOperator[] } {
    if (column?.customType === 'boolean') {
        return { filterOperators: customTypeBooleanOperators };
    }
    return {};
}

/**
 * The header renderer.
 * @param props - The props.
 */
function headerRenderer({ colDef }: ExtendedGridRenderHeaderParams) {
    return (
        <Typography color="primary" fontWeight={600} noWrap>
            {colDef.headerName}
        </Typography>
    );
}

/**
 * The DataGrid props.
 * @public
 */
export type UseDataGridProps = {
    columns: ExtendedGridColDef[],
    onPage: (page: number, pageSize: number, sortModel?: GridSortModel, filterModel?: GridFilterModel) => Promise<{ rows: GridValidRowModel[], totalRowsCount?: number }>,
    tableId?: string,
    /**
     * @defaultValue `20`
     */
    pageSize?: number,
    columnVisibilityModel?: GridColumnVisibilityModel,
    defaultSort?: GridSortModel,
    onRowClick?: any,
    /**
     * @defaultValue `compact` on mobile devices and `standard` on desktop
     */
    density?: GridDensity,
    /**
     * @defaultValue `40`
     */
    rowHeight?: number,
    selection?: boolean,
    checkboxSelection?: boolean,
    /**
     * @defaultValue `false`
     */
    enableColumnFilters?: boolean,
    /**
     * @defaultValue `true`
     */
    enablePagination?: boolean,
    infiniteLoading?: boolean,
    /**
     * @defaultValue `true`
     */
    keepNonExistentRowsSelected?: boolean,
    localeText?: Partial<GridLocaleText>,
    slots?: Partial<UncapitalizedGridProSlotsComponent>,
    slotProps?: GridProSlotProps
};

/**
 * The DataGrid response.
 * @public
 */
export type UseDataGridResponse = {
    props: ComponentPropsWithRef<typeof DataGridPro>,
    filterChanged: (keepPage?: boolean) => void,
    isSelectAll: boolean,
    setIsSelectAll: (value: boolean) => void,
    isAnySelected: boolean,
};

/**
 * DataGrid hook.
 * Configures default table.
 *
 * @param props - The props.
 * @returns The DataGrid component props.
 * @public
 */
export function useDataGrid({
    tableId,
    pageSize = 20,
    columns,
    columnVisibilityModel,
    defaultSort,
    onPage,
    onRowClick,
    rowHeight = 40,
    density,
    selection,
    checkboxSelection,
    enableColumnFilters = false,
    enablePagination = true,
    infiniteLoading,
    keepNonExistentRowsSelected = true,
    localeText = {},
    slots = {},
    slotProps = {}
}: UseDataGridProps): UseDataGridResponse {
    const defaultSortOrFirst: GridSortModel | undefined = defaultSort || (columns.length > 0 ? [{ field: columns[0].field, sort: 'asc' }] : undefined);

    const [loading, setLoading] = useState<number[]>([]);
    const [rows, setRows] = useState<{ totalRows: number, pages: { [pageIndex: number]: GridValidRowModel[] } }>({
        totalRows: 0,
        pages: {}
    });
    const [pageIndex, setPageIndex] = useState(-1);
    const [sortModel, setSortModel] = useState<GridSortModel | undefined>(defaultSortOrFirst);
    const [filterModel, setFilterModel] = useState<GridFilterModel | undefined>(undefined);
    const theme = useTheme();

    /**
     * Requests new page to be loaded.
     * @param page - The page index to load.
     * @param clearCache - If set to true, we will not keep existing pages cache.
     */
    const handleLoadPage = useCallback(async (page: number, clearCache: boolean) => {
        if (loading.includes(page)) return;

        try {
            setLoading((current) => [...current, page]);
            console.debug('Loading page', page, 'with sort', sortModel);

            const response = await onPage(Math.max(page, 0), pageSize, sortModel, filterModel);
            const pageIndexOrZero = page <= 0 ? 0 : page;

            console.debug('Loaded page', page);
            setRows((current) => {
                const pages = clearCache ? {} : { ...current.pages };
                pages[pageIndexOrZero] = response.rows;
                return ({
                    totalRows: response.totalRowsCount
                        ?? (response.rows.length < pageSize
                            ? (pageIndexOrZero * pageSize) + response.rows.length
                            : (pageIndexOrZero + 1) * pageSize + 1),
                    pages
                });
            });
        } finally {
            setLoading((current) => current.filter((p) => p !== page));
        }
    }, [pageSize, sortModel, filterModel, onPage, loading]);

    /**
     * Handles filter changed. This will go back to first page and request page.
     * @param keepPage - If set to true, when filter is changed, page will remain selected; returns to first page if set to false.
     */
    const handleFilterChanged = (keepPage = false) => {
        if (!keepPage) setPageIndex(-1);

        handleLoadPage(keepPage ? pageIndex : -1, true);
    };

    /**
     * Handles the sort model change.
     * @param data - The sort data.
     */
    const handleSortModelChange = (data: GridSortModel) => {
        // To stop random firing after component mounts from making request
        if (data === sortModel) return;

        // Having no sort model, after having default sort model, requires no BE request
        if (!data.length
            && (sortModel?.length && sortModel?.at(0)?.field === defaultSortOrFirst?.at(0)?.field)
            && (sortModel?.length && sortModel?.at(0)?.sort === defaultSortOrFirst?.at(0)?.sort)) {
            setSortModel(data);
            return;
        }

        setSortModel(data);
    };

    /**
     * Handles the filter model change.
     *
     * @param data Grid filter model data
     */
    const handleFilterModelChange = (data: GridFilterModel) => {
        // If the filter items have no value selected just yet, don't make a state change
        if (!!data.items.length && data.items.every((item) => item.value == null)) return;

        // If the filter items with value are the same ones already
        // in the state, don't make a state change
        // this is here to prevent unnecessary rerendering
        const filterItemsWithValues = data.items.filter((item) => item.value != null);
        if (filterItemsWithValues.every((item) =>
            filterModel?.items.find((stateItem) => stateItem.field === item.field && stateItem.value === item.value)) &&
            filterItemsWithValues.length === filterModel?.items.length) {
            return;
        }

        setPageIndex(-1);
        setFilterModel(data);
    };

    // Column visibility
    const [columnVisibility, setColumnVisibility] = useState(() => {
        const savedColumnVisibility = localStorage.getItem(`${columnVisibilityLocalStorageKey}-${tableId}`);
        return Boolean(tableId) && savedColumnVisibility !== null
            ? JSON.parse(savedColumnVisibility)
            : columnVisibilityModel
    });

    /**
     * Handles the column visibility model changing.
     * @param newVisibility - The new visibility model.
     */
    const handleColumnVisibilityChange = (newVisibility: GridColumnVisibilityModel) => {
        setColumnVisibility(newVisibility);
        if (tableId) {
            localStorage.setItem(`${columnVisibilityLocalStorageKey}-${tableId}`, JSON.stringify(newVisibility));
        }
    };

    /**
     * Handles the default column visibility model changing.
     * @param newVisibility - The new visibility model.
     */
    const handleDefaultColumnVisibilityChange = (newVisibility: GridColumnVisibilityModel) => {
        if (!(Boolean(tableId) && localStorage.getItem(`${columnVisibilityLocalStorageKey}-${tableId}`) !== null)) {
            console.debug('Setting default visibility', newVisibility);
            setColumnVisibility(newVisibility);
        }
    };

    const columnVisibilityModelMemo = useMemo(() => columnVisibility, [columnVisibilityModel]);

    useEffect(() => {
        if (columnVisibilityModel) {
            handleDefaultColumnVisibilityChange(columnVisibilityModel);
        }
    }, [columnVisibilityModelMemo]);

    /**
     * Triggering the page load if the page index, sort model or the filter model have changed.
     */
    useEffect(() => {
        if (pageIndex < 0 && sortModel === defaultSortOrFirst) return;

        handleLoadPage(pageIndex, !infiniteLoading);
    }, [pageIndex, sortModel, filterModel]);

    const allRows = Object.values(rows.pages).flat();

    // Selection
    const [customSelectionModel, setCustomSelectionModel] = useState<GridRowSelectionModel>([]);
    const [isAllItemsSelected, setIsAllItemsSelected] = useState(false);
    /**
     * Handles the row selection model changing.
     * @param {GridRowSelectionModel} newRowSelectionModel The new selection model.
     * @returns {void}
     */
    const handleRowSelectionModelChange = (newRowSelectionModel: GridRowSelectionModel) => {
        setCustomSelectionModel(newRowSelectionModel);
    };
    useEffect(() => {
        const isAllSelected = customSelectionModel.length > 0
            && customSelectionModel.length >= allRows.length;
        // Reset select all
        if (!isAllSelected) {
            setIsAllItemsSelected(false);
        }
    }, [customSelectionModel, allRows]);

    /**
     * Handles the select all checkbox click.
     * @param {GridCellParams<any, unknown, unknown, GridTreeNode>} params The params.
     * @param {MuiEvent<React.KeyboardEvent<HTMLElement>>} event The event.
     * @param {GridCallbackDetails<any>} details The details.
     * @returns {void}
     */
    const handleCellKeyDown = (
        params: GridCellParams<any, unknown, unknown, GridTreeNode>,
        event: MuiEvent<React.KeyboardEvent<HTMLElement>>,
        details: any // NOTE: Workaournd for unavailable API in types
    ) => {
        if (selection
            && !checkboxSelection) {
            const currentRowIndex = allRows.indexOf(params.row);
            const nextRowIndex = Math.min(Math.max(currentRowIndex + (event.key === 'ArrowDown' ? 1 : -1), 0), allRows.length - 1);
            const nextRowId = details.api.getRowIdFromRowIndex(nextRowIndex);
            if (nextRowId) {
                setCustomSelectionModel([nextRowId]);
            }
        }
    };

    /**
     * Handles the page change request.
     * @param paginationModel - The pagination model.
     */
    const handlePaginationModelChange = ({ page }: GridPaginationModel) => {
        setPageIndex(page);
    };

    const [isMobile, setIsMobile] = useState(window.innerWidth < theme.breakpoints.values.sm);
    const resizeRef = useResizeObserver(() => {
        setIsMobile(window.innerWidth < theme.breakpoints.values.sm);
    });

    const columnsMemo = useMemo(() => {
        const columnsAdjusted = columns.map((c) => {
        // Get column width from local storage
        let width: number | null | undefined;

        if (tableId) {
            const columnSizeStorageValue = localStorage.getItem(`${columnSizeLocalStorageKey}-${tableId}-${c.field}`);
            if (columnSizeStorageValue) {
                width = Number(columnSizeStorageValue);
            }
        }

        return {
            ...c,
            cellClassName: () => 'mui-datagrid-cell-narrow-on-mobile',
            renderCell: c.renderCell || ((params: ExtendedGridRenderCellParams) => (
                <CellRenderer
                    customType={params.colDef.customType}
                    value={params.value}
                    width={params.width}
                    rowHeight={rowHeight}
                    params={params.colDef}
                />
            )),
            renderHeader: c.renderHeader || headerRenderer,
            ...resolveCustomTypeOperators(c),
            ...width && {
                flex: undefined,
                width
            }
            };
        });

        // Reorder columns based on saves order (if provided)
        if (tableId) {
            columnsAdjusted.forEach((c) => {
                const columnOrderingStorageValue = localStorage.getItem(`${columnOrderingLocalStorageKey}-${tableId}-${c.field}`);
                if (!columnOrderingStorageValue) return;

                const order = JSON.parse(columnOrderingStorageValue);
                if (order != null) {
                    // Move column to new index
                    const index = columnsAdjusted.findIndex((x) => x.field === c.field);
                    columnsAdjusted.splice(index, 1);
                    columnsAdjusted.splice(order, 0, c);
                }
            });
        }

        return columnsAdjusted;
    }, [tableId, columns, headerRenderer, rowHeight]);

    /**
     * Handles rows scroll end action.
     */
    const handleRowsScrollEnd = (params: GridRowScrollEndParams) => {
        if (!infiniteLoading) return;

        console.debug('Infinite loading: loading next page', params);
        handlePaginationModelChange({ page: pageIndex + 1, pageSize });
    };

    /**
     * Handles the column resize action.
     *
     * @param params Grid column resize params
     */
    const handleOnColumnWidthChange = (params: GridColumnResizeParams) => {
        if (tableId && params.width) {
            localStorage.setItem(`${columnSizeLocalStorageKey}-${tableId}-${params.colDef.field}`, params.width.toString());
        }
    };

    // Column pinning
    const [pinnedColumns, setPinnedColumns] = useState(() => {
        const savedPinnedColumns = localStorage.getItem(`${columnPinningLocalStorageKey}-${tableId}`);
        return Boolean(tableId) && savedPinnedColumns != null
            ? JSON.parse(savedPinnedColumns)
            : null
    });

    /**
     * Handles pinned columns change action.
     * 
     * @param newPinnedColumns The new pinned columns.
     */
    const handlePinnedColumnsChange = (newPinnedColumns: GridPinnedColumns) => {
        if (tableId) {
            localStorage.setItem(`${columnPinningLocalStorageKey}-${tableId}`, JSON.stringify(newPinnedColumns));
        }
        setPinnedColumns(newPinnedColumns);
    };

    /**
     * Handles column order change.
     * 
     * @param newColumnOrder The new column order.
     */
    const handleColumnOrderChange = (newColumnOrder: GridColumnOrderChangeParams) => {
        if (tableId) {
            localStorage.setItem(
                `${columnOrderingLocalStorageKey}-${tableId}-${newColumnOrder.column.field}`,
                JSON.stringify(newColumnOrder.targetIndex));
        }
    };

    return {
        props: {
            ref: resizeRef,
            rows: allRows,
            rowCount: rows.totalRows,
            pageSizeOptions: [pageSize],
            density: !!density ? density : (isMobile ? 'compact' : 'standard'),
            sx: (theme: Theme) => ({
                '& .MuiDataGrid-row': {
                    cursor: onRowClick !== undefined ? 'pointer' : 'default'
                },
                ...dataGridSx(theme)
            }),
            columns: columnsMemo,
            columnVisibilityModel: columnVisibility,
            onColumnVisibilityModelChange: handleColumnVisibilityChange,
            onColumnWidthChange: handleOnColumnWidthChange,
            onColumnOrderChange: handleColumnOrderChange,
            pinnedColumns,
            onPinnedColumnsChange: handlePinnedColumnsChange,
            pagination: !infiniteLoading && enablePagination,
            paginationMode: 'server',
            paginationModel: {
                page: Math.max(pageIndex, 0),
                pageSize,
            },
            hideFooterPagination: infiniteLoading,
            onPaginationModelChange: handlePaginationModelChange,
            sortingMode: 'server',
            sortModel,
            disableDensitySelector: true,
            onSortModelChange: handleSortModelChange,
            disableColumnFilter: !enableColumnFilters,
            filterMode: 'server',
            filterDebounceMs: 500,
            onFilterModelChange: handleFilterModelChange,
            hideFooterSelectedRowCount: true,
            loading: loading.length > 0,
            localeText: {
                noRowsLabel: 'Nema zapisa',
                ...localeText
            },
            onRowClick,
            rowHeight,
            scrollEndThreshold: rowHeight * Math.round(pageSize / 2),
            onRowsScrollEnd: handleRowsScrollEnd,
            onCellKeyDown: handleCellKeyDown,
            columnHeaderHeight: rowHeight + 1,
            disableRowSelectionOnClick: !selection,
            checkboxSelection,
            rowSelectionModel: customSelectionModel,
            onRowSelectionModelChange: handleRowSelectionModelChange,
            slots: {
                loadingOverlay: LinearProgress,
                ...slots
            },
            slotProps,
            keepNonExistentRowsSelected
        },
        filterChanged: handleFilterChanged,
        isSelectAll: isAllItemsSelected,
        setIsSelectAll: setIsAllItemsSelected,
        isAnySelected: customSelectionModel.length > 0,
    };
}
