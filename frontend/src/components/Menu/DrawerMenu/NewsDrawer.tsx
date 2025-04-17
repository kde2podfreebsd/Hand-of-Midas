/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined, FileTextOutlined, LinkOutlined, NotificationOutlined } from "@ant-design/icons";
import type { TabsProps } from 'antd';
import { Button, Card, Divider, Drawer, List, Menu, Modal, Select, Spin, Tabs, Tag, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { api } from "../../../api";
import { reactMarkdownOptions } from "../../../constants";

const { Text, Paragraph } = Typography;
const { Option } = Select;

const menuStyle: React.CSSProperties = {
  textAlign: 'left',
  backgroundColor: 'inherit',
};

export const NewsDrawer = () =>{
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedNews, setFeedNews] = useState<any[]>([]);
  const [analyticsNews, setAnalyticsNews] = useState<any[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const loadTags = useCallback(async () => {
    try {
      const response = await api.news.getTags();
      setTags(response.tags);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  }, []);

  const loadFeedNews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.news.getNews();
      setFeedNews(response.posts);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAnalyticsNews = useCallback(async (tags: string[] = []) => {
    setLoading(true);
    try {
      const response = tags.length > 0 
        ? await api.news.getNewsByTag(tags) 
        : await api.news.getNews();
      setAnalyticsNews(response.posts);
    } catch (error) {
      console.error('Error loading analytics news:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const response = await api.news.getSummaryByTag(selectedTags);
      setSummary(response.summary);
      setIsSummaryModalOpen(true);
    } catch (error) {
      console.error('Error loading summary:', error);
    } finally {
      setSummaryLoading(false);
    }
  }, [selectedTags]);

  const handleTagChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const handleSummarizeClick = () => {
    if (selectedTags.length > 0) {
      loadSummary();
    }
  };

  useEffect(() => {
    if (!open) return;

    loadTags();
    loadFeedNews();
    loadAnalyticsNews();
  }, [open, loadTags, loadFeedNews, loadAnalyticsNews]);

  useEffect(() => {
    if (open && selectedTags.length > 0) {
      loadAnalyticsNews(selectedTags);
    }
  }, [open, selectedTags, loadAnalyticsNews]);

  const newsTabItems: TabsProps['items'] = [
    {
      key: 'feed',
      label: 'Лента новостей',
      children: (
        <List
          dataSource={feedNews}
          renderItem={(item) => (
            <Card 
              bordered={false}
              style={{ marginBottom: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {item.tags.map((tag: string) => (
                  <Tag key={tag} color="processing">{tag}</Tag>
                ))}
              </div>
              
              <Paragraph ellipsis={{ rows: 3 }}>{item.text}</Paragraph>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <Text type="secondary">
                    <EyeOutlined /> {item.views}
                  </Text>
                  <Text type="secondary">{new Date(item.date).toLocaleDateString()}</Text>
                  <Text strong style={{ color: '#1890ff' }}>
                    {item.source}
                  </Text>
                </div>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <LinkOutlined /> Источник
                </a>
              </div>
            </Card>
          )}
        />
      ),
    },
    {
      key: 'analytics',
      label: 'Аналитика',
      children: (
        <>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <Select
              mode="multiple"
              style={{ flex: 1 }}
              placeholder="Выберите теги для анализа"
              onChange={handleTagChange}
              value={selectedTags}
            >
              {tags.map(tag => (
                <Option key={tag} value={tag}>{tag}</Option>
              ))}
            </Select>
            <Button 
              type="primary" 
              icon={<FileTextOutlined />}
              onClick={handleSummarizeClick}
              disabled={selectedTags.length === 0}
              loading={summaryLoading}
            >
              Summary
            </Button>
          </div>

          <List
            dataSource={analyticsNews}
            renderItem={(item) => (
              <Card bordered={false} style={{ marginBottom: 16 }}>
                <Text strong>{item.source}</Text>
                <Text type="secondary" style={{ marginLeft: 12 }}>
                  {new Date(item.date).toLocaleDateString()}
                </Text>
                <Paragraph ellipsis={{ rows: 2 }} style={{ margin: '8px 0' }}>
                  {item.text}
                </Paragraph>
                <div style={{ display: 'flex', gap: 8 }}>
                  {item.tags.map((tag: string) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </Card>
            )}
          />
        </>
      ),
    },
  ];

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
          onClick={() => setOpen(true)}
        >
          Новости
        </Menu.Item>
      </Menu>

      <Drawer
        width="35vw"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <NotificationOutlined />
            <Text strong>Новостная лента</Text>
          </div>
        }
        placement="right"
        closable={false}
        onClose={() => setOpen(false)}
        open={open}
        key="right"
        bodyStyle={{ padding: 24 }}
      >
        <Spin spinning={loading}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={newsTabItems}
            tabBarStyle={{ marginBottom: 24 }}
          />
        </Spin>
      </Drawer>

      <Modal
        title="Аналитическая сводка"
        open={isSummaryModalOpen}
        onCancel={() => setIsSummaryModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsSummaryModalOpen(false)}>
            Закрыть
          </Button>
        ]}
        width={800}
      >
        {summary ? (
          <div style={{ padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
            <ReactMarkdown {...reactMarkdownOptions}>
              {summary}
            </ReactMarkdown>
          </div>
        ) : (
          <Spin tip="Загрузка сводки..." />
        )}
      </Modal>
    </>
  );
};