'use client';

import { SideNav, SideNavItem, SideNavItemGroup } from '@enterwell/react-ui';
import { Button } from '@mui/material';
import { Stack } from '@mui/system';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

export function ExampleSideNav() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedItem = searchParams.get('item');
    const show = searchParams.get('show') === 'true';
    function setShow(show: boolean) {
        const query = new URLSearchParams(Array.from(searchParams.entries()));
        if (!show)
            query.delete('show');
        else query.set('show', show.toString());
        router.push(`?${query.toString()}`);
    }

    return (
        <>
            {show && (
                // @highlight-start
                <SideNav header={(
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <div className="flex flex-row gap-1 items-center whitespace-nowrap">
                            <Image
                                alt="Enterwell"
                                width={32}
                                height={32}
                                src="https://enterwell.net/wp-content/uploads/2023/05/ew-logomark-monochrome-negative-64.x71089.svg" />
                            <span className="text-xs sm:text-sm md:text-lg">Enterwell {'<'}UI{' \\>'}</span>
                        </div>
                    </Stack>
                )}>
                    <SideNavItem href="?item=1&show=true" selected={selectedItem === '1'}>Item 1</SideNavItem>
                    <SideNavItem href="?item=2&show=true" selected={selectedItem === '2'}>Item 2</SideNavItem>
                    <SideNavItemGroup label="Group 1" defaultExpanded={selectedItem === '3' || selectedItem === '4'}>
                        <SideNavItem href="?item=3&show=true" selected={selectedItem === '3'}>Item 3</SideNavItem>
                        <SideNavItem href="?item=4&show=true" selected={selectedItem === '4'}>Item 4</SideNavItem>
                    </SideNavItemGroup>
                </SideNav>
                // @highlight-end
            )}
            <Button variant='contained' onClick={() => setShow(!show)}>Toggle SideNav</Button>
        </>
    )
}