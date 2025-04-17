import { Col, Flex, Row } from "antd";
import { useEffect, useState } from "react";
import { api } from "../../api";
import { GetPoolsResponse } from "../../api/pool/get-pools";
import { fmtUsdAmount } from "../../utils";

export const PoolsPage = () => {
  const [pools, setPools] = useState<GetPoolsResponse>([]);
  const [loading, setLoading] = useState(true);

  void loading;

  useEffect(() => {
    api.pool.list().then(pools => {
      setPools(pools);
      setLoading(false);
    })
  }, [])


  return (
    <div
      style={{
        padding: '15px 40px 0 40px',
        // backgroundColor: 'red',
        height: '100%', // Занимаем всю высоту viewport
        boxSizing: 'border-box', // Учитываем padding в размерах
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Верхний блок с текстом */}
      <div
        style={{
          backgroundColor: '#fafafc',
          width: '100%',
          minHeight: '7vh',
          borderRadius: '15px 15px 0 0',
          border: '1px solid #F0F0F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        <Row style={{ width: '100%', height: '100%' }}>
          <Col span={24/8}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
              Пул
            </div>
          </Col>
          <Col span={24/8}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
              Протокол
            </div>
          </Col>
          <Col span={24/8}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
              Fee
            </div>
          </Col>
          <Col span={24/8}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
              TVL
            </div>
          </Col>
          <Col span={24/8}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
              APR
            </div>
          </Col>
          <Col span={24/8}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
              VOL (1d)
            </div>
          </Col>
          <Col span={24/8}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
              VOL (30d)
            </div>
          </Col>
          <Col span={24/8}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
              VOL/TVL
            </div>
          </Col>
        </Row>
      </div>

      {/* Контейнер с карточками */}
      <div
        className="no-scrollbar"
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          scrollBehavior: 'smooth',
          border: '1px solid #F0F0F0',
        }}
      >
        {pools.map((pool, i) => {
          return <div key={i} style={{ width: '100%', borderBottom: '1px solid #F0F0F0', height: '8vh' }}>
             <Row style={{ width: '100%', height: '100%' }}>
              <Col span={24/8}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
                  <strong>{pool.pool_name}</strong>
                </div>
              </Col>
              <Col span={24/8}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
                  <Flex
                    justify="center"
                    align="center"
                    style={{
                      fontSize: 12,
                      borderRadius: 10,
                      backgroundColor: '#DBE8FB',
                      color: '#0080FF',
                      padding: '5px',
                    }}
                  >
                    {pool.protocol.toLowerCase()}
                  </Flex>
                </div>
              </Col>
              <Col span={24/8}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
                  ${parseFloat(Number(pool.fee).toFixed(2))}
                </div>
              </Col>
              <Col span={24/8}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
                  {fmtUsdAmount(parseInt(pool.tvl))}
                </div>
              </Col>
              <Col span={24/8}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
                  <Flex
                    justify="center"
                    align="center"
                    style={{
                      fontSize: 12,
                      borderRadius: 10,
                      background: 'linear-gradient(90deg, #6253e1, #04befe)',
                      minWidth: '40px',
                      padding: '5px',
                      color: 'white',
                    }}
                  >
                    {parseFloat(Number(pool.apr).toFixed(2))}%
                  </Flex>
                </div>
              </Col>
              <Col span={24/8}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
                  {fmtUsdAmount(parseInt(pool.vol_1d))}
                </div>
              </Col>
              <Col span={24/8}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
                  {fmtUsdAmount(parseInt(pool.vol_30d))}
                </div>
              </Col>
              <Col span={24/8}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
                  {parseFloat(Number(pool.vol_tvl_ratio).toFixed(2))}
                </div>
              </Col>
            </Row>
          </div>
        })}
      </div>
    </div>
  );
};