import { Card, CardActionArea, CardContent } from "@mui/material";
import Image from "next/image";

const availablePackages = [
    { name: "UI", description: "Component library.", href: '/ui/react-ui/about', library: 'react' },
    { name: "Hooks", description: "Hooks library.", href: '/ui/react-hooks/about', library: 'react' },
];

export function PackagesList() {
    return (
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-20">
                {availablePackages.map((pkg) => (
                    <Card key={pkg.name} className="rounded-lg border bg-card shadow-xl">
                        <CardActionArea href={pkg.href}>
                            <CardContent className="flex items-center justify-center aspect-square">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="text-4xl font-extrabold drop-shadow-[0_0_32px_hsl(var(--foreground))]">{pkg.name}</div>
                                    <div className="text-muted-foreground text-center">{pkg.description}</div>
                                </div>
                                <div className="absolute right-2 bottom-2 opacity-20">
                                    <Image alt="React" width={32} height={32} src="/ui/assets/react.svg" />
                                </div>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </div>
        </div>
    );
}