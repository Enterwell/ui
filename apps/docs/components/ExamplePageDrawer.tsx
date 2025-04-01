'use client';

import { PageDrawer } from '@enterwell/react-ui';
import { useState } from 'react';

export function ExamplePageDrawer() {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="max-h-72 overflow-y-auto">
            <div className='flex flex-col items-center justify-center'>
                {(Array(100).fill(0)).map((_, i) => (<div>Page content {i}</div>))}
            </div>
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