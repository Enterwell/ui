import { NpmPackageCard } from "./NpmPackageCard";

type PackageDescriptionProps = {
    metadata: any;
}

export function PackageDescription({ metadata }: PackageDescriptionProps) {
    return (
        <div className="flex flex-col gap-4">
            <p>{metadata.description}</p>
            <h2 className="text-2xl font-bold">Package</h2>
            <div className="max-w-fit">
                <NpmPackageCard name={metadata.name} version={metadata.version} />
            </div>
        </div>
    )
}

export function PackagePeerDependencies({ metadata }: PackageDescriptionProps) {
    const peerDependencyNames = Object.keys(metadata.peerDependencies || {});

    return (
        <div className="flex flex-col gap-2">
            {peerDependencyNames.map(name => (
                <NpmPackageCard name={name} version={metadata.peerDependencies[name]} />
            ))}
        </div>
    )
}