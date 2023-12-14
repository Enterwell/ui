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
    LinearProgress
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
} from '@mui/x-data-grid-pro';
import { useResizeObserver } from '@enterwell/react-hooks';
import { format } from 'date-fns';
import { Select } from '@enterwell/react-ui';

const DISPLAY_DATETIME_FORMAT = "dd.MM.yyyy. HH:mm:ss";
const DISPLAY_DATE_FORMAT = "dd.MM.yyyy.";
const columnVisibilityLocalStorageKey = 'muidatagrid-columnvisibility';

const dataGridSx = {
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
        color: '#F3BB7B'
    }
};

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

type ExtendedGridColDef = GridColDef<GridValidRowModel> & {
    customType?: CellRendererCustomType
    enum?: { get: (value: any) => { label: string } | undefined },
    width?: number
};

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
        const enumLabel = params.enum?.get(value)?.label;
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
    onPage: (page: number, sortModel?: GridSortModel) => Promise<{ rows: GridValidRowModel[], totalRowsCount?: number }>,
    tableId?: string,
    pageSize?: number,
    columnVisibilityModel?: GridColumnVisibilityModel,
    defaultSort?: GridSortModel,
    renderCell?: (params: any) => React.ReactElement,
    onRowClick?: any,
    rowHeight?: number,
    selection?: boolean,
    checkboxSelection?: boolean,
    infiniteLoading?: boolean,
    keepNonExistentRowsSelected?: boolean
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
    renderCell,
    onPage,
    onRowClick,
    rowHeight = 40,
    selection,
    checkboxSelection,
    infiniteLoading,
    keepNonExistentRowsSelected = true
}: UseDataGridProps): UseDataGridResponse {
    const defaultSortOrFirst: GridSortModel | undefined = defaultSort || (columns.length > 0 ? [{ field: columns[0].field, sort: 'asc' }] : undefined);

    const [loading, setLoading] = useState<number[]>([]);
    const [rows, setRows] = useState<{ totalRows: number, pages: { [pageIndex: number]: GridValidRowModel[] } }>({
        totalRows: 0,
        pages: {}
    });
    const [pageIndex, setPageIndex] = useState(-1);
    const [sortModel, setSortModel] = useState<GridSortModel | undefined>(defaultSortOrFirst);
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

            const response = await onPage(Math.max(page, 0), sortModel);
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
    }, [pageSize, sortModel, onPage, loading]);

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

    // Column visibility
    const [columnVisibility, setColumnVisibility] = useState(
        Boolean(tableId) && localStorage.getItem(`${columnVisibilityLocalStorageKey}-${tableId}`) !== null
            ? JSON.parse(localStorage.getItem(`${columnVisibilityLocalStorageKey}-${tableId}`) ?? "")
            : columnVisibilityModel
    );

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

    useEffect(() => {
        if (pageIndex < 0 && sortModel === defaultSortOrFirst) return;
        handleLoadPage(pageIndex, !infiniteLoading);
    }, [pageIndex, sortModel]);

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

    const columnsMemo = useMemo(() => columns.map((c) => ({
        ...c,
        cellClassName: () => 'mui-datagrid-cell-narrow-on-mobile',
        renderCell: renderCell || ((params: ExtendedGridRenderCellParams) => (
            <CellRenderer
                customType={params.colDef.customType}
                value={params.value}
                width={params.width}
                rowHeight={rowHeight}
                params={params.colDef}
            />
        )),
        renderHeader: headerRenderer,
        ...resolveCustomTypeOperators(c),
    })), [columns, renderCell, headerRenderer, rowHeight]);

    return {
        props: {
            ref: resizeRef,
            rows: allRows,
            rowCount: rows.totalRows,
            pageSizeOptions: [pageSize],
            density: isMobile ? 'compact' : 'standard',
            sx: {
                '& .MuiDataGrid-row': {
                    cursor: onRowClick !== undefined ? 'pointer' : 'default'
                },
                ...dataGridSx
            },
            columns: columnsMemo,
            columnVisibilityModel: columnVisibility,
            onColumnVisibilityModelChange: handleColumnVisibilityChange,
            paginationMode: 'server',
            paginationModel: {
                page: Math.max(pageIndex, 0),
                pageSize,
            },
            onPaginationModelChange: handlePaginationModelChange,
            sortingMode: 'server',
            sortModel,
            disableColumnFilter: true,
            disableDensitySelector: true,
            onSortModelChange: handleSortModelChange,
            hideFooterSelectedRowCount: true,
            loading: loading.length > 0,
            localeText: {
                noRowsLabel: 'Nema zapisa'
            },
            onRowClick,
            rowHeight,
            onCellKeyDown: handleCellKeyDown,
            columnHeaderHeight: rowHeight + 1,
            disableRowSelectionOnClick: !selection,
            checkboxSelection,
            rowSelectionModel: customSelectionModel,
            onRowSelectionModelChange: handleRowSelectionModelChange,
            slots: {
                loadingOverlay: LinearProgress,
            },
            keepNonExistentRowsSelected
        },
        filterChanged: handleFilterChanged,
        isSelectAll: isAllItemsSelected,
        setIsSelectAll: setIsAllItemsSelected,
        isAnySelected: customSelectionModel.length > 0,
    };
}
