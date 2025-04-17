/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Divider, Radio, Space, Typography } from "antd";
import React, { useState } from "react";
import { externalIframeGroups, internalIframeGroups } from "./mock";

const { Title, Text } = Typography;

const AnalyticsView = ({ groups }: any) => {
  return (
    <div style={{ marginTop: 24 }}>
      {Object.entries(groups).map(([groupName, charts]) => (
        <React.Fragment key={groupName}>
          <Title level={3} style={{ margin: '24px 0 16px 0', color: '#2c3e50' }}>
            {groupName}
          </Title>
          <Divider style={{ margin: '0 0 24px 0', borderColor: '#f0f0f0' }} />
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {(charts as any[]).map((chart, index) => (
              <Card 
                key={index}
                title={<Text strong>{chart.title}</Text>}
                headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '0 24px' }}
                bodyStyle={{ padding: 0 }}
                style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${chart.iframes.length}, 1fr)`,
                  gap: '12px',
                  height: '400px',
                  padding: 12
                }}>
                  {chart.iframes.map((iframeSrc: string, i: number) => (
                    <iframe 
                      key={i}
                      src={iframeSrc}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        border: 'none',
                        borderRadius: '8px',
                      }}
                    />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export const AnalyticsPage = () => {
  const [analyticsType, setAnalyticsType] = useState('external');

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      padding: '24px 48px',
      overflowY: 'auto',
      scrollBehavior: 'smooth',
      backgroundColor: '#fafafa'
    }}>
      <Card 
        bodyStyle={{ padding: '16px 24px' }}
        style={{ 
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          marginBottom: 24,
          // position: 'sticky',
          // top: 0,
          // zIndex: 1
        }}
      >
        <Space size="large" align="center">
          <Text strong style={{ fontSize: 16 }}>Тип аналитики:</Text>
          <Radio.Group 
            value={analyticsType}
            onChange={(e) => setAnalyticsType(e.target.value)}
            buttonStyle="solid"
            size="large"
          >
            <Radio.Button value="external" style={{ width: 160, textAlign: 'center' }}>
              Внешняя
            </Radio.Button>
            <Radio.Button value="internal" style={{ width: 160, textAlign: 'center' }}>
              Внутренняя
            </Radio.Button>
          </Radio.Group>
        </Space>
      </Card>

      {analyticsType === 'external' ? (
        <AnalyticsView groups={externalIframeGroups} />
      ) : (
        <AnalyticsView groups={internalIframeGroups} />
      )}
    </div>
  );
};