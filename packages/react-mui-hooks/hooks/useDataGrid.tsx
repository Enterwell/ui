import {
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
} from '@mui/x-data-grid-pro';
import {
    type DataGridProps,
} from '@mui/x-data-grid';
import { useResizeObserver } from '@enterwell/react-hooks';
import { format } from 'date-fns';

const DISPLAY_DATETIME_FORMAT = "dd.MM.yyyy. HH:mm:ss";
const DISPLAY_DATE_FORMAT = "dd.MM.yyyy.";
const columnVisibilityLocalStorageKey = 'muidatagrid-columnvisibility';

export const dataGridSx = {
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
 * @param {*} props Props
 * @returns {*} The component.
 */
function Text(props) {
    const { children, width, rowHeight } = props;
    return (
        <Typography
            title={typeof children === 'string' ? children.toString() : null}
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

/**
 * The cell renderer.
 *
 * @param props - The props.
 * @returns The cell function component.
 */
export function CellRenderer({
    customType, value, width, rowHeight, params
}) {
    if (customType === 'datetime') {
        return <Text width={width} rowHeight={rowHeight}>{format(value, DISPLAY_DATETIME_FORMAT)}</Text>;
    }
    if (customType === 'enum') {
        return <Text width={width} rowHeight={rowHeight}>{params.enum.get(value).label}</Text>;
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
        return <Text width={width} rowHeight={rowHeight}>{value ? format(value, DISPLAY_DATE_FORMAT) : ''}</Text>;
    }
    if (customType === 'boolean') {
        return <Text width={width} rowHeight={rowHeight}>{value ? 'Da' : 'Ne'}</Text>;
    }
    if (customType === 'html') {
        // eslint-disable-next-line react/no-danger
        return <div dangerouslySetInnerHTML={value} />;
    }
    if (customType === 'deviceStatus' || customType === 'status') {
        return <DeviceStatusIndicator {...value} />;
    }
    if (typeof (value) === 'object' && isValidElement(value)) {
        return value;
    }
    return <Text width={width} rowHeight={rowHeight}>{typeof value === 'number' || typeof value === 'boolean' || value ? value.toString() : ''}</Text>;
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
     * @param {object[]} selectedItems The selected items.
     * @returns {void}
     */
    const handleChange = (selectedItems) => {
        applyValue({ ...item, value: selectedItems[0]?.value });
    };

    const items = [
        { label: 'Da', value: 'true' },
        { label: 'Ne', value: 'false' }
    ];

    return (
        <Select
            label="Vrijednost"
            selected={items.filter((x) => x.value === item.value)}
            items={items}
            onSelection={handleChange}
        />
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
export function resolveCustomTypeOperators(column: object): GridFilterOperator[] {
    if (column?.customType === 'boolean') {
        return { filterOperators: customTypeBooleanOperators };
    }
    return {};
}

/**
 * The header renderer.
 * @param {object} props The props.
 * @returns {object} The component.
 */
export function headerRenderer({ colDef }) {
    return (
        <Typography color="primary" fontWeight={600} noWrap>
            {colDef.headerName}
        </Typography>
    );
}

export type UseDataGridTableProps = {
    tableId?: string,
    pageSize?: number,
    columns: any[],
    columnVisibilityModel?: GridColumnVisibilityModel,
    defaultSort?: any[],
    renderCell?: (params: any) => React.ReactElement,
    onPage: (page: number, sortModel: any[]) => Promise<unknown[]>,
    onRowClick?: any,
    rowHeight?: number,
    selection?: boolean,
    checkboxSelection?: boolean,
    infiniteLoading?: boolean,
    keepNonExistentRowsSelected?: boolean
};

/**
 * DataGrid hook.
 * Configures default table.
 *
 * @param props - The props.
 * @returns The DataGrid component props.
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
}: UseDataGridTableProps) {
    const defaultSortOrFirst = defaultSort || (columns.length > 0 ? [{ field: columns[0].field, sort: 'asc' }] : null);

    const [loading, setLoading] = useState([]);
    const [rows, setRows] = useState({
        totalRows: 0,
        pages: {}
    });
    const [pageIndex, setPageIndex] = useState(-1);
    const [sortModel, setSortModel] = useState(defaultSortOrFirst);
    const theme = useTheme();

    /**
     * Requests new page to be loaded.
     * @param {number} page The page index to load.
     * @param {boolean} clearCache If set to true, we will not keep existing pages cache.
     * @returns {void}
     */
    const handleLoadPage = useCallback(async (page, clearCache) => {
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
    const handleSortModelChange = (data: object) => {
        // To stop random firing after component mounts from making request
        if (data === sortModel) return;

        // Having no sort model, after having default sort model, requires no BE request
        if (!data.length
            && (sortModel.length && sortModel[0].field === defaultSortOrFirst[0].field)
            && (sortModel.length && sortModel[0].sort === defaultSortOrFirst[0].sort)) {
            setSortModel(data);
            return;
        }

        setSortModel(data);
    };

    // Column visibility
    const [columnVisibility, setColumnVisibility] = useState(
        Boolean(tableId) && localStorage.getItem(`${columnVisibilityLocalStorageKey}-${tableId}`) !== null
            ? JSON.parse(localStorage.getItem(`${columnVisibilityLocalStorageKey}-${tableId}`))
            : columnVisibilityModel
    );

    /**
     * Handles the column visibility model changing.
     * @param newVisibility - The new visibility model.
     */
    const handleColumnVisibilityChange = (newVisibility) => {
        setColumnVisibility(newVisibility);
        if (tableId) {
            localStorage.setItem(`${columnVisibilityLocalStorageKey}-${tableId}`, JSON.stringify(newVisibility));
        }
    };

    /**
     * Handles the default column visibility model changing.
     * @param newVisibility - The new visibility model.
     */
    const handleDefaultColumnVisibilityChange = (newVisibility) => {
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
        details: GridCallbackDetails<any>
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
     * @param {object} paginationModel The pagination model.
     * @returns {void}
     */
    const handlePaginationModelChange = ({ page }) => {
        setPageIndex(page);
    };

    const [isMobile, setIsMobile] = useState(window.innerWidth < theme.breakpoints.values.sm);
    const resizeRef = useResizeObserver(() => {
        setIsMobile(window.innerWidth < theme.breakpoints.values.sm);
    });

    const columnsMemo: GridColDef[] = useMemo(() => columns.map((c) => ({
        ...c,
        cellClassName: () => 'mui-datagrid-cell-narrow-on-mobile',
        renderCell: renderCell || ((params) => (
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
        ref: resizeRef,
        rows: allRows,
        rowCount: rows.totalRows,
        filterChanged: handleFilterChanged,
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
        isSelectAll: isAllItemsSelected,
        setIsSelectAll: setIsAllItemsSelected,
        isAnySelected: customSelectionModel.length > 0,
        rowSelectionModel: customSelectionModel,
        onRowSelectionModelChange: handleRowSelectionModelChange,
        slots: {
            loadingOverlay: LinearProgress,
        },
        keepNonExistentRowsSelected
    } satisfies DataGridProps;
}
