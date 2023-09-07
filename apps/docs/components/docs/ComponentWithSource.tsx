"use client";

import { useState } from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Card } from "./Card";

type ComponentWithSourceProps = React.HTMLAttributes<HTMLDivElement> & {
  component: React.FunctionComponent;
}

export function ComponentWithSource({
  children,
  component,
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
      <TabPanel value="preview">
        <Card>
          <Component />
        </Card>
      </TabPanel>
      <TabPanel value="code">
        {children}
      </TabPanel>
    </TabContext>
  )
}