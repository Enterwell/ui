import { useControllableState } from "@enterwell/react-hooks";
import { useState } from "react";

export function ExampleUseControllableState() {
    const [outsideState, setOutsideState] = useState<string | undefined>(undefined);

    // @highlight-start
    const [value, setValue] = useControllableState(outsideState, 'default');
    // @highlight-end

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <span>{outsideState}</span>
                <input type="text" value={outsideState || ''} onChange={e => setOutsideState(e.target.value)} />
                <button onClick={() => setOutsideState(undefined)}>Reset outside state</button>
            </div>

            <div className="p-2 border rounded-md flex flex-col items-center space-y-4">
                <span>{value}</span>
                <input type="text" value={value} onChange={e => setValue(e.target.value)} />
                <button onClick={() => setValue('default')}>Set default</button>
            </div>
        </div>
    );
}