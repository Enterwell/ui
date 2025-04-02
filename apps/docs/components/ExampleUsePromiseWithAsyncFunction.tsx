'use client';

import { usePromise } from '@enterwell/react-hooks';

const getData = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    return await response.json();
};

export function ExampleUsePromiseWithAsyncFunction() {
    // @highlight-start
    const { item, isLoading, error } = usePromise(getData);
    // @highlight-end

    return (
        <div>
            <div>Items count: {item?.length}</div>
            <div>Loading: {isLoading ? 'yes' : 'no'}</div>
            <div>Error: {error ?? 'no'}</div>
        </div>
    );
}