import { Col, Row, Spin } from 'antd';
import React, { ReactNode } from 'react';

export const WithLoader: React.FC<{ children: ReactNode, msMax: number, loading?: boolean }> = ({ children, loading }) => {
  if (!loading) {
    return <>{children}</>
  }

  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Col>
        <Spin tip="Загрузка" size="large"/>
      </Col>
    </Row>
  )
};