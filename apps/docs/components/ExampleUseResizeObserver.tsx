'use client';

import { useState } from 'react';
import { useResizeObserver } from '@enterwell/react-hooks';

export function ExampleUseResizeObserver() {
    const [value, setValue] = useState(0);
    const [items, setItems] = useState([1, 2, 3]);
    // @highlight-start
    const resizeObserverRef = useResizeObserver((_, entry) => {
        const { height } = entry.contentRect;
        setValue(height);
    });
    // @highlight-end

    return (
        <div>
            <div>List height (px): {value}</div>
            <ul ref={resizeObserverRef}>
                {items.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
            <button onClick={() => setItems((curr) => [...curr, curr.length + 1])}>Add item</button>
        </div>
    );
}