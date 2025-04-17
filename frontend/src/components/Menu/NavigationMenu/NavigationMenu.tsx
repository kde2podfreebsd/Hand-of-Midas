import { AreaChartOutlined, BankOutlined, DeploymentUnitOutlined, TransactionOutlined, WalletOutlined, WechatWorkOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useContext, useEffect, useState } from "react";
import { PAGE_HEADER } from "../../../constants/pages";
import { PageContext, Pages } from "../../../providers/PageProvider";

const menuStyle: React.CSSProperties = {
  textAlign: 'left',
  backgroundColor: 'inherit',
}

export const NavigationMenu = () => {
  const { page, renderPage } = useContext(PageContext);

  const [current, setCurrent] = useState(Pages.Chat);
  const handleClick = (e: { key: string }) => {
    setCurrent(e.key as Pages); // Обновляем состояние при клике на элемент меню
  };

  useEffect(() => {
    setCurrent(page);
  }, [page])

  return (
    <Menu
      onClick={handleClick}
      selectable
      selectedKeys={[current]} // Определяем активный элемент
      mode="vertical" // Вертикальный режим меню
      style={menuStyle}
    >
      <Menu.Item
        key={Pages.Chat}
        icon={<WechatWorkOutlined />}
        onClick={() => renderPage(Pages.Chat)}
      >
        {PAGE_HEADER[Pages.Chat]}
      </Menu.Item>
      <Menu.Item
        key={Pages.Wallets}
        icon={<WalletOutlined />}
        onClick={() => renderPage(Pages.Wallets)}
      >
        {PAGE_HEADER[Pages.Wallets]}
      </Menu.Item>
      <Menu.Item
        key={Pages.Pools}
        icon={<DeploymentUnitOutlined />}
        onClick={() => renderPage(Pages.Pools)}
      >
        {PAGE_HEADER[Pages.Pools]}
      </Menu.Item>
      <Menu.Item
        key={Pages.Transactions}
        icon={<TransactionOutlined />}
        onClick={() => renderPage(Pages.Transactions)}
      >
        {PAGE_HEADER[Pages.Transactions]}
      </Menu.Item>
      <Menu.Item
        key={Pages.Actives}
        icon={<BankOutlined />}
        onClick={() => renderPage(Pages.Actives)}
      >
        {PAGE_HEADER[Pages.Actives]}
      </Menu.Item>
      <Menu.Item
        key={Pages.Analytics}
        icon={<AreaChartOutlined />}
        onClick={() => renderPage(Pages.Analytics)}
      >
        {PAGE_HEADER[Pages.Analytics]}
      </Menu.Item>
    </Menu>
  )
}