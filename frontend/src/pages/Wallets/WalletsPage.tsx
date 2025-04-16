import { useWallet } from "@suiet/wallet-kit";
import { Avatar, Card, Col, Flex, Row, Space, Typography } from "antd";
import { useContext } from "react";
import { WithLoader } from "../../components/WithLoader/WithLoader";
import { EthereumContext } from "../../providers/EthereumProvider";
import { ConnectEthereumButton } from "./Ethereum/ConnectButton";
import { DisconnectEthereumButton } from "./Ethereum/DisconnectButton";
import { ConnectSuiButton } from "./Sui/ConnectButton";
import { DisconnectSuiButton } from "./Sui/DisconnectButton";

export const WalletsPage = () => {
  const { address: ethAddress } = useContext(EthereumContext);
  const { address: suiAddress } = useWallet();


  return(
    <WithLoader msMax={300}>
      <div style={{ padding: '15px' }}>
        <Space direction="vertical" size={16} style={{ display: 'flex' }}>
          {/* ETH */}
          <Card style={{ width: '100%', height: 100 }}>
            <Row>
              <Col span={3}>
                <Space direction='horizontal' size={15}>
                <Avatar size={45} src="https://logowik.com/content/uploads/images/t_ethereum-eth7803.logowik.com.webp" />
                  <Typography.Title level={5} style={{ margin: 0, padding: 0 }}>ETH</Typography.Title>
                </Space>
              </Col>

              <Col span={13}>
                <Flex justify='flex-start' align='center' style={{ width: '100%', height: '100%' }}>
                  {ethAddress && <Typography.Text copyable ellipsis style={{ width: 700 }}>{ethAddress}</Typography.Text>}
                </Flex>
              </Col>
              <Col span={8}>
                <Flex justify='flex-end' align='center' style={{ width: '100%', height: '100%' }}>
                  <Space direction='horizontal' size={10}>
                    <ConnectEthereumButton/>
                    <DisconnectEthereumButton/>
                  </Space>
                </Flex>
              </Col>
            </Row>
          </Card>

          {/* SUI */}
          <Card style={{ width: '100%', height: 100 }}>
            <Row>
              <Col span={3}>
                <Space direction='horizontal' size={15}>
                  <Avatar size={40} src="https://assets.crypto.ro/logos/sui-sui-logo.png" />
                  <Typography.Title level={5} style={{ margin: 0, padding: 0 }}>SUI</Typography.Title>
                </Space>
              </Col>

              <Col span={13}>
                <Flex justify='flex-start' align='center' style={{ width: '100%', height: '100%' }}>
                  {suiAddress && <Typography.Text copyable ellipsis style={{ width: 700 }}>{suiAddress}</Typography.Text>}
                </Flex>
              </Col>
              <Col span={8}>
                <Flex justify='flex-end' align='center' style={{ width: '100%', height: '100%' }}>
                  <Space direction='horizontal' size={10}>
                    <ConnectSuiButton/>
                    <DisconnectSuiButton/>
                  </Space>
                </Flex>
              </Col>
            </Row>
          </Card>
        </Space>
      </div>
    </WithLoader>
  );
}
