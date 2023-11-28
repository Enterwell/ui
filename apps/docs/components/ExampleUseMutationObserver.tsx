import { useState } from 'react';
import { useMutationObserver } from '@enterwell/react-hooks';

export function ExampleUseMutationObserver() {
    const [mutations, setMutations] = useState<MutationRecord[]>([]);
    
    // @highlight-start
    useMutationObserver(
        document.querySelector('html'),
        (mutations) => {
            setMutations((curr) => [...curr, ...mutations]);
        }, {
            attributes: true,
            characterData: true,
            childList: true,
        });
    // @highlight-end

    return (
        <div>
            <p>Try changing theme to trigger DOM changes.</p>
            <br />
            <div>Mutations:</div>
            <ul>
                {mutations.map((mutation, index) => (
                    <li key={index}>
                        <pre>{JSON.stringify(mutation, null, 2)}</pre>
                    </li>
                ))}
            </ul>
        </div>
    );
}