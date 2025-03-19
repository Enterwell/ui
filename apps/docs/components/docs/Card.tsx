import { cx } from "classix";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...rest }: CardProps) {
    return (
        <div className={cx("rounded-lg border border-neutral-700 bg-card text-card-foreground shadow-xs", className)} {...rest}></div>
    );
}