import { NotificationOutlined } from "@ant-design/icons";
import { Drawer, Menu } from "antd";
import { useState } from "react";

const menuStyle: React.CSSProperties = {
  textAlign: 'left',
  backgroundColor: 'inherit',
}

export const DrawerMenu = () => {
  const [open, setOpen] = useState(false);
  
  const onClose = () => {
    setOpen(false);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  return (
    <>
      <Menu
        selectable={false}
        mode="vertical"
        style={menuStyle}
      >
        <Menu.Item
          key="news"
          icon={<NotificationOutlined />}
          onClick={showDrawer}
        >
          Новости
        </Menu.Item>
      </Menu>

      <Drawer
        width='35vw'
        title="Новости"
        placement='right'
        closable={false}
        onClose={onClose}
        open={open}
        key='right'
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  )
}