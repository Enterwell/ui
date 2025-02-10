type DocsHeaderProps = {
    header: string;
    subHeader?: string;
};

export function DocsHeader({ header, subHeader }: DocsHeaderProps) {
    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-5xl lg:text-6xl mt-12 lg:!mt-20 mx-6 font-extrabold leading-tight xl:leading-snug text-center mb-4">
                {header}
            </h1>
            <p className="mx-6 text-xl md:text-2xl text-center text-[#666666] dark:text-[#888888]">
                {subHeader}
            </p>
        </div>
    );
}