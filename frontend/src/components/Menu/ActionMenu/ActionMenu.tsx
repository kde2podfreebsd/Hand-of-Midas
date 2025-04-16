import { BulbOutlined, EditOutlined } from "@ant-design/icons";
import { Menu, Modal } from "antd";
import { useContext, useEffect, useState } from "react";
import { PageContext, Pages } from "../../../providers/PageProvider";

const menuStyle: React.CSSProperties = {
  textAlign: 'left',
  backgroundColor: 'inherit',
}

export const ActionMenu = () => {
  const { renderPage } = useContext(PageContext);
  const [confirm, setConfirm] = useState(false);
  const [modal, showModal] = useState(false);
  const [action, setAction] = useState('');

  const handleOk = () => {
    setConfirm(true);
    showModal(false);
  }

  const handleCancel = () => {
    setConfirm(false);
    showModal(false);
  }

  const handleStartForm = () => {
    setAction('Анкетирование');
    showModal(true);
  }

  useEffect(() => {
    if (confirm) {
      renderPage(Pages.Chat);
      setConfirm(false);
    }
  }, [confirm, renderPage])

  return (
    <>
      <Menu
        selectable={false}
        mode="vertical" // Вертикальный режим меню
        style={menuStyle}
      >
        <Menu.Item
          key="start_form"
          icon={<EditOutlined />}
          onClick={handleStartForm}
        >
          Провести анкетирование
        </Menu.Item>
        <Menu.Item
          key="invest_recommendations"
          icon={<BulbOutlined />}
        >
          Инвестиционные рекомендации
        </Menu.Item>
      </Menu>

      <Modal
        title={`Вы хотите начать сценарий "${action}"?`}
        centered
        open={modal}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Подтвердить"
        cancelText="Закрыть"
      >
        <p>Это действие может изменить контекст чата и настройки профиля</p>
      </Modal>
    </>
    
  )

}