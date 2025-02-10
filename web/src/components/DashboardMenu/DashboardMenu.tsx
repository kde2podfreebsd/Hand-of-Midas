import { Center, rem, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';
import {
  IconHome2,
  IconLogout,
  IconMessageCircle,
  IconSwitchHorizontal,
  IconWallet
} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import classes from './DashboardMenu.module.css';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconMessageCircle, label: 'Assistant', route: '/assistant' },
  { icon: IconWallet, label: 'Wallet', route: '/wallet' },
];

export function DashboardMenu() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSelect = (index: number) => {
    const target = mockdata[index];
    if (target.route === location.pathname) {
      return;
    }

    navigate(target.route)
  }

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={link.route === location.pathname}
      onClick={() => handleSelect(index)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center>
        <MantineLogo type="mark" size={30} />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={rem(10)}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
        <NavbarLink icon={IconLogout} label="Logout" />
      </Stack>
    </nav>
  );
}