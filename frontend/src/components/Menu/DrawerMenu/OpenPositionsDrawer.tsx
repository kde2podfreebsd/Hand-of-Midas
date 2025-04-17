import { DollarOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Drawer, List, Menu, Statistic, Typography } from "antd";
import { useState } from "react";

const { Title, Text } = Typography;

const menuStyle: React.CSSProperties = {
  textAlign: 'left',
  backgroundColor: 'inherit',
};

export const OpenPositionsDrawer = () => {
  const [open, setOpen] = useState(false);
  
  // Временные данные для примера
  const positions = [
    {
      pool: "UNISWAP ETH/USDC",
      apr: "6.74%",
      ethAmount: "0.005 ETH",
      usdcAmount: "7.92 USDT",
      fees: "$1.42 per last month"
    }
  ];

  return (
    <>
      <Menu
        selectable={false}
        mode="vertical"
        style={menuStyle}
      >
        <Menu.Item
          key="positions"
          icon={<DollarOutlined />}
          onClick={() => setOpen(true)}
        >
          Открытые позиции
        </Menu.Item>
      </Menu>

      <Drawer
        width="35vw"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DollarOutlined />
            <Text strong>Открытые позиции</Text>
          </div>
        }
        placement="right"
        closable={false}
        onClose={() => setOpen(false)}
        open={open}
        bodyStyle={{ padding: 24 }}
      >
        <div style={{ marginBottom: 24 }}>
          <Title level={4} style={{ marginBottom: 24 }}>Текущие позиции</Title>
          
          <List
            dataSource={positions}
            renderItem={(item) => (
              <Card 
                bordered={false}
                style={{ 
                  marginBottom: 16,
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong style={{ fontSize: 16 }}>{item.pool}</Text>
                  <Text type="success">{item.apr} APR</Text>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Statistic title="ETH" value={item.ethAmount} />
                  <Statistic title="USDC" value={item.usdcAmount} />
                  <Statistic title="Комиссии" value={item.fees} />
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                  <Button type="primary" danger>Withdraw</Button>
                  <Button type="primary">Deposit/Add Liquidity</Button>
                </div>
              </Card>
            )}
          />
        </div>

        <Divider />

        <div style={{ marginTop: 32 }}>
          <Title level={4} style={{ marginBottom: 16 }}>График популярности пулов</Title>
          <div style={{
            height: 200,
            // background: '#f0f2f5',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <iframe src="https://dune.com/embeds/340977/649408" style={{
              width: "100%",
              height: "100%",
              border: "none"
            }} />
          </div>
        </div>

        <Divider />

        <div style={{ marginTop: 24 }}>
          <Title level={4}>Заключение</Title>
          <Text>
            На основании текущего портфеля пользователя и данных о пуле инвестирования – 
            ETH-USDT с <strong style={{ color: 'blue' }}>APR 6.74%</strong>. Это решение обеспечивает баланс между доходностью 
            и доступностью ликвидности.
          </Text>
        </div>
      </Drawer>
    </>
  );
};