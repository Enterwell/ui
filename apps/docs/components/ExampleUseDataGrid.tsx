import { TypedExtendedGridColDef, useDataGrid } from '@enterwell/react-mui-hooks';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useEffect } from 'react';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
}

type TodoRow = {
  id: number;
  title: string;
  status: string;
}

async function getData(page: number, pageSize: number) {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    return (await response.json()).slice(page * pageSize, page * pageSize + pageSize);
}

export function ExampleUseDataGrid() {
    const columns: TypedExtendedGridColDef<TodoRow>[] = [
        { field: 'title', headerName: 'Title' },
        { field: 'status', headerName: 'Status' }
    ];

    const handleOnPage = async (page: number, pageSize: number): Promise<{
        rows: TodoRow[];
        totalRowsCount?: number;
    }> => {
        const response = await getData(page, pageSize);
        return {
            rows: response.map((item: Todo) => ({
              id: item.id,
              title: item.title,
              status: item.completed ? 'Completed' : 'Not Completed'
            }))
        };
    };

    const dataGrid = useDataGrid({
        tableId: 'example-use-data-grid',
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