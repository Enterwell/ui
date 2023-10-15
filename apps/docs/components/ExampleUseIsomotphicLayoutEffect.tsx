import { useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '@enterwell/react-hooks';

export function ExampleUseIsomotphicLayoutEffect() {
    const [value, setValue] = useState(0);
    const [items, setItems] = useState([1, 2, 3]);
    const ref = useRef<HTMLUListElement>(null);
    // @highlight-start
    useIsomorphicLayoutEffect(() => {
        setValue(ref.current?.clientHeight ?? 0);
    }, [items]);
    // @highlight-end

    return (
        <div>
            <div>List height (px): {value}</div>
            <ul ref={ref}>
                {items.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
            <button onClick={() => setItems((curr) => [...curr, curr.length + 1])}>Add item</button>
        </div>
    );
}