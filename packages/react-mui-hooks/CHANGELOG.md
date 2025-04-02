# React MUI Hooks changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

_NOTE: This is an automatically generated file. Do not modify contents of this file manually._

## [0.9.0] - 2025-04-01
### Changed
- Migrated to MUI 6

## [0.8.0] - 2024-06-18
### Changed
- [useDataGrid] Disabled column hide when last one is left
- [useDataGrid] Hide all columns button removed

## [0.7.0] - 2024-01-19
### Added
- [useDataGrid] Column pinning support
- [useDataGrid] Column ordering support

### Changed
- [useDataGrid] Properly forwarding the ColDef's `cellClassName` property
- [useDataGrid] `filterChanged` prop renamed to `refreshTable`

### Fixed
- [useDataGrid] Keyboard navigation
- [useDataGrid] Reduced the number of rerenders

## [0.6.0] - 2024-01-04
### Added
- [useDataGrid] Documented props' default values
- [useDataGrid] `enableColumnFilters` optional prop for server side filtering
- [useDataGrid] `localeText` optional prop
- [useDataGrid] `density` optional prop
- [useDataGrid] Saving column widths to the local storage
- [useDataGrid] `slots` and `slotProps` optional props

### Fixed
- [useDataGrid] missing enum value error

## [0.5.0] - 2023-12-20
### Added
- [useDataGrid] localeText optional prop

## [0.4.0] - 2023-12-20
### Added
- [useDataGrid] `enablePagination` optional prop

### Changed
- [useDataGrid] Pagination enabled by default

## [0.3.0] - 2023-12-15
### Added
- ExtendedGridColDef type export
- Type-safe types for usage with useDataGrid hook

### Fixed
- ExtendedGridColDef's renderHeader function properly used
- useDataGrid's enum cell renderer
- ExtendedGridColDef's renderCell function properly used
- Incosistent useDataGrid's page size

### Removed
- useDataGrid's renderCell prop
- Data grid community version dependency

## [0.2.3] - 2023-11-27
### Fixed
- Loosen peer-dependencies

## [0.2.2] - 2023-10-31
### Fixed
- Updated dependencies

## [0.2.1] - 2023-10-15
### Fixed
- Updated dependencies
- useDataGrid types

## [0.2.0] - 2023-09-26
### Added
- useDataGrid hook

## [0.1.0] - 2023-09-20
### Added
- Initial version
