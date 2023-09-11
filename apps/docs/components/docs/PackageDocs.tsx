import { Card, CardActionArea, Chip } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

type PackageDescriptionProps = {
    metadata: any;
}

export function PackageDescription({ metadata }: PackageDescriptionProps) {
    return (
        <div className="flex flex-col gap-4">
            <p>{metadata.description}</p>
            <h2 className="text-2xl font-bold">Package</h2>
            <Card className="max-w-fit rounded-lg border bg-card shadow-xl">
                <CardActionArea href={`https://www.npmjs.com/package/${metadata.name}`} className="flex items-center gap-2 px-4 py-2">
                    <div className="flex items-center gap-2">
                        <Image width={32} height={32} src="/ui/assets/npm.svg" alt="NPM" />
                        <span>{metadata.name}@{metadata.version}</span>
                    </div>
                    <Chip label={metadata.license} />
                </CardActionArea>
            </Card>
        </div>
    )
}

export function PackagePeerDependencies({ metadata }: PackageDescriptionProps) {
    const peerDependencyNames = Object.keys(metadata.peerDependencies || {});

    return (
        <div className="flex flex-col gap-2">
            {peerDependencyNames.map(name => (
                <Card className="rounded-lg border bg-card shadow-xl">
                    <CardActionArea href={`https://www.npmjs.com/package/${metadata.name}`}>
                        <div className="px-4 py-2 flex items-center justify-between gap-4 w-full">
                            <span className="flex items-center gap-2">
                                <Image width={32} height={32} src="/ui/assets/npm.svg" alt="NPM" />
                                <span>{name}</span>
                            </span>
                            <span>{metadata.peerDependencies[name]}</span>
                        </div>
                    </CardActionArea>
                </Card>
            ))}
        </div>
    )
}