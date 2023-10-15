import { ComponentProps } from "react";
import { Tabs } from 'nextra/components'
import { Card } from "./Card";
import cx from "classix";
import { NoSsr } from "@mui/material";

type ComponentWithSourceProps = Omit<ComponentProps<typeof Tabs>, 'items'> & {
  component: React.FunctionComponent;
  centered?: boolean;
}

export function ComponentWithSource({
  children,
  component,
  centered,
  ...rest
}: ComponentWithSourceProps) {
  const Component = component;

  return (
    <Tabs items={['Preview', 'Code']} {...rest}>
      <Tabs.Tab>
        <Card className={cx(
          centered && "p-2 min-h-[280px] flex gap-2 items-center justify-center"
        )}>
          <NoSsr>
            <Component />
          </NoSsr>
        </Card>
      </Tabs.Tab>
      <Tabs.Tab>
        {children}
      </Tabs.Tab>
    </Tabs>
  )
}