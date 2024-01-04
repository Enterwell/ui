import { Card, CardActionArea } from "@mui/material";
import { NpmIcon } from "../internal/icons/NpmIcon";

type NpmPackageCardProps = {
    name: string;
    version: string;
}

export function NpmPackageCard({ name, version }: NpmPackageCardProps) {
    return (
        <Card className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-card shadow-xl">
            <CardActionArea href={`https://www.npmjs.com/package/${name}`}>
                <div className="px-4 py-2 flex items-center justify-between gap-4 w-full">
                    <span className="flex items-center gap-2">
                        <NpmIcon width={32} height={32} />
                        <span>{name}</span>
                    </span>
                    <span>v{version}</span>
                </div>
            </CardActionArea>
        </Card>
    )
}