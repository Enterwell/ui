import { ExtendedGridColDef, useDataGrid } from '@enterwell/react-mui-hooks';
import { DataGridPro, GridValidRowModel } from '@mui/x-data-grid-pro';
import { useEffect } from 'react';

async function getData(page: number, pageSize: number) {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    return (await response.json()).slice(page * pageSize, page * pageSize + pageSize);
}

export function ExampleUseDataGrid() {
    const columns: ExtendedGridColDef[] = [
        { field: 'title', headerName: 'Title' },
        { field: 'status', headerName: 'Status' },
    ];

    const handleOnPage = async (page: number): Promise<{
        rows: GridValidRowModel[];
        totalRowsCount?: number | undefined;
    }> => {
        const response = await getData(page, 20);
        return {
            rows: response.map((item: any) => ({
                id: item.id,
                title: item.title,
                status: item.completed ? 'Completed' : 'Not Completed'
            }))
        };
    };

    const dataGrid = useDataGrid({
        columns,
        onPage: handleOnPage
    });

    useEffect(() => {
        dataGrid.filterChanged();
    }, []);

    return (
        <DataGridPro autoHeight {...dataGrid.props} />
    );
}