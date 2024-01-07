import { SideNav, SideNavItem, SideNavItemGroup } from '@enterwell/react-ui';
import { Button } from '@mui/material';
import { Stack } from '@mui/system';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function ExampleSideNav() {
    const params = useSearchParams();
    const selectedItem = params.get('item');
    const [show, setShow] = useState(false);

    return (
        <>
            {show && (
                // @highlight-start
                <SideNav header={(
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <div className="flex flex-row gap-1 items-center whitespace-nowrap">
                            <Image
                                alt="Enterwell"
                                className='image--dark'
                                width={32}
                                height={32}
                                src="https://enterwell.net/wp-content/uploads/2023/05/ew-logomark-monochrome-negative-64.x71089.svg" />
                            <Image
                                alt="Enterwell"
                                className='image--light'
                                width={32}
                                height={32}
                                src="https://enterwell.net/wp-content/uploads/2023/05/ew-logomark-monochrome-positive-64.x71089.svg" />
                            <span className="text-xs sm:text-sm md:text-lg">Enterwell {'<'}UI{' \\>'}</span>
                        </div>
                    </Stack>
                )}>
                    <SideNavItem href="?item=1" selected={selectedItem === '1'}>Item 1</SideNavItem>
                    <SideNavItem href="?item=2" selected={selectedItem === '2'}>Item 2</SideNavItem>
                    <SideNavItemGroup label="Group 1">
                        <SideNavItem href="?item=3" selected={selectedItem === '3'}>Item 3</SideNavItem>
                        <SideNavItem href="?item=4" selected={selectedItem === '4'}>Item 4</SideNavItem>
                    </SideNavItemGroup>
                </SideNav>
                // @highlight-end
            )}
            <Button variant='contained' onClick={() => setShow(!show)}>Toggle SideNav</Button>
        </>
    )
}