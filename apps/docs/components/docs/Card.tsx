import { cx } from "classix";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...rest }: CardProps) {
    return (
        <div className={cx("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...rest}></div>
    );
}