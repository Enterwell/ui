import { SearchHeader } from '@enterwell/react-ui';

export function ExampleSearchHeader() {
    return (
        <SearchHeader
            variant='h4'
            onSubmit={(searchTerm) => console.log(searchTerm)}
            placeholder='Search by term'>
            Search
        </SearchHeader>
    )
}