import { Card, CardActionArea, CardContent } from "@mui/material";
import { ReactIcon } from "./icons/ReactIcon";
import { MuiIcon } from "./icons/MuiIcon";

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
                    <Card key={pkg.name} className="!rounded-none border-none !shadow-none animated-card">
                        <CardActionArea href={pkg.href}>
                            <CardContent className="flex items-center justify-center aspect-square">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="text-4xl text-center font-extrabold">{pkg.name}</div>
                                    <div className="text-muted-foreground text-center">{pkg.description}</div>
                                </div>
                                <div className="absolute right-3 bottom-3 opacity-50 flex flex-row items-center gap-2">
                                    {pkg.libraries.includes('react') && <ReactIcon width={32} height={32} />}
                                    {pkg.libraries.includes('mui') && <MuiIcon width={32} height={32} />}
                                </div>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </div>
        </div>
    );
}