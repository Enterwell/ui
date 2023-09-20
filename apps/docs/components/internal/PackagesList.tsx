import { Card, CardActionArea, CardContent } from "@mui/material";
import Image from "next/image";

const availablePackages = [
    { name: "UI", description: "Component library.", href: '/ui/react-ui/about', libraries: ['react', 'mui'] },
    { name: "Hooks", description: "Hooks library.", href: '/ui/react-hooks/about', libraries: ['react'] },
    { name: "MUI Hooks", description: "Material UI hooks library.", href: '/ui/react-mui-hooks/about', libraries: ['react', 'mui'] },
];

export function PackagesList() {
    return (
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-20">
                {availablePackages.map((pkg) => (
                    <Card key={pkg.name} className="rounded-lg border bg-card dark:border-neutral-700 shadow-xl">
                        <CardActionArea href={pkg.href}>
                            <CardContent className="flex items-center justify-center aspect-square">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="text-4xl text-center font-extrabold drop-shadow-[0_0_32px_hsl(var(--foreground))]">{pkg.name}</div>
                                    <div className="text-muted-foreground text-center">{pkg.description}</div>
                                </div>
                                <div className="absolute right-3 bottom-3 opacity-20 flex flex-row items-center gap-2">
                                    {pkg.libraries.includes('react') && <Image alt="React" width={32} height={32} src="/ui/assets/react.svg" />}
                                    {pkg.libraries.includes('mui') && <Image alt="MUI" width={32} height={32} src="/ui/assets/mui.svg" />}
                                </div>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </div>
        </div>
    );
}