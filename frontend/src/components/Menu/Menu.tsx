import { Divider, Flex } from 'antd';
import { ActionMenu } from './ActionMenu/ActionMenu';
import { DrawerMenu } from './DrawerMenu/DrawerMenu';
import { NavigationMenu } from './NavigationMenu/NavigationMenu';

import { AntDesignOutlined } from '@ant-design/icons';
import { Button, ConfigProvider } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(90deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

const GradientHeader: React.FC = () => {
  const { styles } = useStyle();

  return (
    <ConfigProvider
      button={{
        className: styles.linearGradientButton,
      }}
    >
      <Flex style={{ width: '100%', height: '7vh' }} justify='center' align='center'>
        <Button type="primary" size="large" icon={<AntDesignOutlined />} style={{ width: '97%', height: '6vh' }}>
          DeFi Wizard
        </Button>
      </Flex>

    </ConfigProvider>
  );
};

export const Menu = () => {
  return (
    <Flex vertical>
      <GradientHeader/>

      <div style={{ width: '100%', height: 10 }}></div>

      <NavigationMenu/>
      <Divider/>
      <ActionMenu />
      <Divider/>
      <DrawerMenu/>
    </Flex>
  );
};