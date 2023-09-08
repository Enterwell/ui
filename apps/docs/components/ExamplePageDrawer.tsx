import { PageDrawer } from '@enterwell/ui';
import { useState } from 'react';

export function ExamplePageDrawer() {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center relative h-72 overflow-hidden rounded-lg">
            <span>Page content</span>
            <PageDrawer
                expanded={expanded}
                onChange={() => setExpanded((curr) => !curr)}>
                <span>Drawer content</span>
            </PageDrawer>
        </div>
    )
}