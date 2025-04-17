import { ArrowDownOutlined, ArrowUpOutlined, RetweetOutlined } from "@ant-design/icons";
import { Col, Row, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../../api";
import { Transaction, TransactionType } from "../../api/transaction/types";
import { UserContext } from "../../providers/UserProvider";
import { fmtUsdAmount } from "../../utils";

const txTypes: Record<TransactionType, React.JSX.Element> = {
  [TransactionType.In]: <ArrowDownOutlined style={{ color: 'green', fontSize: 16 }}/>,
  [TransactionType.Out]: <ArrowUpOutlined style={{ color: 'red', fontSize: 16 }}/>,
  [TransactionType.Swap]: <RetweetOutlined style={{ color: 'blue', fontSize: 16 }}/>,
}

export const TransactionsPage = () => {
  const { user } = useContext(UserContext);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  void loading;

  useEffect(() => {
    if (user && !transactions.length) {
      api.transaction.list(user).then(transactions => {
        console.log(transactions);
        setTransactions(transactions);
        setLoading(false);
      })
    }
  }, [transactions.length, user])


  return (
    <div
      style={{
        padding: '15px 40px 0 40px',
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
          <Col span={2}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
              Протокол
            </div>
          </Col>
          <Col span={2}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
              Токен
            </div>
          </Col>
          <Col span={1}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
              Тип
            </div>
          </Col>
          <Col span={2}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
              Дата
            </div>
          </Col>
          <Col span={5}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
              Hash
            </div>
          </Col>
          <Col span={3}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
              Отправитель
            </div>
          </Col>
          <Col span={3}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
              Получатель
            </div>
          </Col>
          <Col span={2}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
              VOL
            </div>
          </Col>
          <Col span={2}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
              Gas fee
            </div>
          </Col>
          <Col span={2}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
              VOL ($)
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
        {transactions.map((tx, i) => {
          return <div key={i} style={{ width: '100%', borderBottom: '1px solid #F0F0F0', height: '8vh' }}>
             <Row style={{ width: '100%', height: '100%' }}>
              <Col span={2}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
                  <strong>{tx.blockchain}</strong>
                </div>
              </Col>
              <Col span={2}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
                  <strong>
                    {tx.token.toUpperCase()}
                  </strong>
                </div>
              </Col>
              <Col span={1}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '0px' }}>
                  {txTypes[tx.transaction_type]}
                </div>
              </Col>
              <Col span={2}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
                  {new Date(tx.date).toISOString().split('T')[0]}
                </div>
              </Col>
              <Col span={5}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
                  <Typography.Text copyable ellipsis style={{ width: '90%' }}>
                    {tx.tx_hash}
                  </Typography.Text>
                </div>
              </Col>
              <Col span={3}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
                  <Typography.Text copyable ellipsis style={{ width: 120 }}>
                    {tx.sender}
                  </Typography.Text>
                </div>
              </Col>
              <Col span={3}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
                  <Typography.Text copyable ellipsis style={{ width: 120 }}>
                    {tx.receiver}
                  </Typography.Text>
                </div>
              </Col>
              <Col span={2}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
                  {tx.volume}
                </div>
              </Col>
              <Col span={2}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
                  {tx.gas_fee}
                </div>
              </Col>
              <Col span={2}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', paddingLeft: '10px' }}>
                  {fmtUsdAmount(tx.dollar_equivalent)}
                </div>
              </Col>
            </Row>
          </div>
        })}
      </div>
    </div>
  );
};