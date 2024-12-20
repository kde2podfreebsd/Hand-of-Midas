import { HeaderTabs } from '@/components/Shell/HeaderTabs/HeaderTabs';
import { NavbarMinimalColored } from '@/components/Shell/NavbarMinimalColored/NavbarMinimalColored';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function BasicAppShell() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 65 }}
      navbar={{ width: 'inherit', breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <HeaderTabs/>
      </AppShell.Header> 

      <AppShell.Navbar>
        <NavbarMinimalColored/>
      </AppShell.Navbar>

      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  );
}