'use client';

import { useMemo } from 'react';
import { usePromise } from '@enterwell/react-hooks';

function getItems() {
    return new Promise<number[]>((resolve) => {
        setTimeout(() => {
            resolve([1, 2, 3]);
        }, 1000);
    });
}

export function ExampleUsePromiseWithPromiseObject() {
    // @highlight-start
    const getItemsMemo = useMemo(() => getItems(), []);
    const { item, isLoading, error } = usePromise(getItemsMemo);
    // @highlight-end

    return (
        <div>
            <div>Items: {item?.join(', ')}</div>
            <div>Loading: {isLoading ? 'yes' : 'no'}</div>
            <div>Error: {error ?? 'no'}</div>
        </div>
    );
}