import { PageDrawer } from '@enterwell/react-ui';
import { useState } from 'react';

export function ExamplePageDrawer() {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center relative h-72 overflow-hidden rounded-lg">
            <span>Page content</span>
            {/* // @highlight-start */}
            <PageDrawer
                expanded={expanded}
                onChange={() => setExpanded((curr) => !curr)}>
                <span>Drawer content</span>
            </PageDrawer>
            {/* // @highlight-end */}
        </div>
    )
}