import { PageDrawer } from '@enterwell/ui';
import { useState } from 'react';

export function ExamplePageDrawer() {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className='relative' style={{position: 'relative', height: 300}}>
        <PageDrawer expanded={expanded} onChange={() => setExpanded((curr) => !curr)}>
            <span>Content</span>
        </PageDrawer>
        </div>
    )
}