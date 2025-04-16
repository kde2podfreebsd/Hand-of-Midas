import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { api } from "../../api";
import { GetPoolsResponse } from "../../api/pool/get-pools";


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
          flexGrow: 1, // Растягивается на доступное пространство
          overflowY: 'auto', // Добавляем скролл при переполнении
          scrollBehavior: 'smooth',
          border: '1px solid #F0F0F0',
        }}
      >
        {pools.map((pool, i) => {
          return <div key={i} style={{ width: '100%', border: '1px solid #F0F0F0', height: '8vh' }}>
             <Row style={{ width: '100%', height: '100%' }}>
              <Col span={24/8}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
                  {pool.pool_name}
                </div>
              </Col>
              <Col span={24/8}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
                  {pool.protocol}
                </div>
              </Col>
              <Col span={24/8}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
                  {Number(pool.fee).toFixed(2)}
                </div>
              </Col>
              <Col span={24/8}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
                  {Number(pool.tvl).toFixed(2)}
                </div>
              </Col>
              <Col span={24/8}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
                {Number(pool.apr).toFixed(2)}
                </div>
              </Col>
              <Col span={24/8}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
                  {Number(pool.vol_1d).toFixed(2)}
                </div>
              </Col>
              <Col span={24/8}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
                {Number(pool.vol_30d).toFixed(2)}
                </div>
              </Col>
              <Col span={24/8}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '25px' }}>
                {Number(pool.vol_tvl_ratio).toFixed(2)}
                </div>
              </Col>
            </Row>
          </div>
        })}
      </div>
    </div>
  );
};