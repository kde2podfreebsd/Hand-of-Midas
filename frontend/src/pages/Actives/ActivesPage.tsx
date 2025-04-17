import { Card, Divider, Flex, Space, Tag, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../../api";
import { BlockchainPortfolioItem, PortfolioAsset, PortfolioData } from "../../api/portfolio/types";
import { UserContext } from "../../providers/UserProvider";

const { Title, Text } = Typography;

export const ActivesPage = () => {
  const { user } = useContext(UserContext);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  void isLoading;

  useEffect(() => {
    const loadPortfolio = async (userId: string) => {
      try {
        const data = await api.portfolio.get(userId);
        setPortfolio(data);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadPortfolio(user);
    }
  }, [user]);

  const renderAsset = (asset: PortfolioAsset) => (
    <Card.Grid 
      style={{ 
        width: '100%',
        boxShadow: 'none',
        border: '1px solid #f0f0f0',
        borderRadius: 8,
        marginBottom: 16
      }}
    >
      <Flex justify="space-between" align="center">
        <Space size="large">
          <Tag color="processing" style={{ fontSize: 16, padding: '4px 12px' }}>
            {asset.coin}
          </Tag>
          
          <div>
            <Text strong>{asset.amount.toLocaleString()}</Text>
            <Text type="secondary" style={{ marginLeft: 8 }}>
              (${asset.dollar_equivalent.toLocaleString()})
            </Text>
          </div>
        </Space>

        <Text type="secondary">
          {asset.address.length} адр{asset.address.length !== 1 ? 'есов' : 'ес'}
        </Text>
      </Flex>
    </Card.Grid>
  );

  const renderBlockchain = (blockchain: BlockchainPortfolioItem) => {
    const [chainName, assets] = Object.entries(blockchain)[0];
    
    return (
      <Card
        title={chainName}
        style={{ marginBottom: 24 }}
        headStyle={{ fontSize: 18, fontWeight: 600 }}
        extra={
          <Text strong>
            Итого: $
            {assets.reduce((sum, asset) => sum + asset.dollar_equivalent, 0)
              .toLocaleString()}
          </Text>
        }
      >
        {assets.map((asset, index) => (
          <React.Fragment key={index}>
            {renderAsset(asset)}
            {index < assets.length - 1 && <Divider style={{ margin: 8 }} />}
          </React.Fragment>
        ))}
      </Card>
    );
  };

  return (
    <div style={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        padding: '24px 30px',
        overflowY: 'auto',
        scrollBehavior: 'smooth',
        flex: 1
      }}>
        <Title level={2} style={{ marginBottom: 24 }}>
          Обзор портфеля
        </Title>

        <Space size="large" style={{ marginBottom: 32 }}>
          <Card bordered={false}>
            <Text type="secondary">Общий баланс</Text>
            <Title level={3}>${portfolio?.total_balance.toLocaleString()}</Title>
          </Card>
          
          <Card bordered={false}>
            <Text type="secondary">Ethereum</Text>
            <Title level={3}>${portfolio?.total_balance_eth.toLocaleString()}</Title>
          </Card>
          
          <Card bordered={false}>
            <Text type="secondary">SUI</Text>
            <Title level={3}>${portfolio?.total_balance_sui.toLocaleString()}</Title>
          </Card>
        </Space>

        <Title level={4} style={{ marginBottom: 16 }}>
          Активы по блокчейнам
        </Title>

        {portfolio?.Blockchain.map((blockchain, index) => (
          <React.Fragment key={index}>
            {renderBlockchain(blockchain)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};