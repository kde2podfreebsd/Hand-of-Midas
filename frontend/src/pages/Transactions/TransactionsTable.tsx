import {
  ClockCircleOutlined,
  CopyOutlined,
  EyeOutlined,
  FolderOutlined
} from '@ant-design/icons';
import { Button, Space, Table, Tooltip } from 'antd';

const columns = [
  {
    title: 'Transaction Hash',
    dataIndex: 'hash',
    key: 'hash',
    render: (text: string) => (
      <Space>
        <EyeOutlined />
        <Tooltip title={text}>{text.slice(0, 10)}...</Tooltip>
        <CopyOutlined />
      </Space>
    ),
  },
  {
    title: 'Method',
    dataIndex: 'method',
    key: 'method',
    render: () => <Button type="primary">Transfer</Button>,
  },
  // Block column omitted as per instruction
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'From',
    dataIndex: 'from',
    key: 'from',
    render: (text: string) => (
      <Space>
        <ClockCircleOutlined />
        {text}
        <CopyOutlined />
      </Space>
    ),
  },
  {
    title: 'To',
    dataIndex: 'to',
    key: 'to',
    render: (text: string) => (
      <Space>
        <FolderOutlined />
        {text}
        <CopyOutlined />
      </Space>
    ),
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Txn Fee',
    dataIndex: 'fee',
    key: 'fee',
  },
];

const data = new Array(8)
  .fill({
    key: 1,
    hash: '0x458bfd209af...',
    method: 'Transfer',
    date: '37 secs ago',
    from: 'Gate.io 1',
    to: 'Tether: USDT Stabl...',
    amount: '0 ETH',
    fee: '0.00007079',
  })
  .map((item, i) => ({
    ...item,
    key: i
  }));

const TransactionsTable = () => (
    <Table columns={columns} dataSource={data} pagination={{ pageSize: 25 }} />
);

export default TransactionsTable;