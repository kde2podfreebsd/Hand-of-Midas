import { Button, ConfigProvider } from "antd";
import { createStyles } from "antd-style";
import React, { ReactNode } from "react";

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

export const GradientButton: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { styles } = useStyle();
  
  return (
    <ConfigProvider
      button={{
        className: styles.linearGradientButton,
      }}
    >
      <Button type="primary" size="large">
        {children}
      </Button>
    </ConfigProvider>
    
  )
}