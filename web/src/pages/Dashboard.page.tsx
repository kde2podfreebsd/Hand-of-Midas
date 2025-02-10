import { DashboardMenu } from "@/components/DashboardMenu/DashboardMenu";
import { Box, Flex } from "@mantine/core";
import React from "react";

export function DashboardPage(props: { children: React.ReactNode}) {
  return (
    <Flex direction="row" justify="flex-start" mih="100vh">
      {/* Menu */}
      <Box bg="#171717" w='5.5vw'>
        <DashboardMenu/>
      </Box>

      {/* Content */}
      <Box bg="#212121" w='94.5vw'>
        {props.children}
      </Box>

    </Flex>
  )
}