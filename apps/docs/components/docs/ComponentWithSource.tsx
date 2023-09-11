"use client";

import { useState } from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Card } from "./Card";
import cx from "classix";

type ComponentWithSourceProps = React.HTMLAttributes<HTMLDivElement> & {
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

  const [tabValue, setTabValue] = useState('preview');
  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <TabContext value={tabValue}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} {...rest}>
        <TabList onChange={handleTabChange} aria-label="Component Preview and Code">
          <Tab label="Preview" value="preview" />
          <Tab label="Code" value="code" />
        </TabList>
      </Box>
      <TabPanel value="preview" className="p-0">
        <Card className={cx(
          centered && "p-2 min-h-[280px] flex gap-2 items-center justify-center"
        )}>
          <Component />
        </Card>
      </TabPanel>
      <TabPanel value="code" className="p-0">
        {children}
      </TabPanel>
    </TabContext>
  )
}