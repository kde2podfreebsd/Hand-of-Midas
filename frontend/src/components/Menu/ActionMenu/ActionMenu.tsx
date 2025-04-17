// ActionMenu.tsx
import { BulbOutlined, EditOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useState } from "react";
import { SurveyModal } from "../../Survey/SurveyModal";

const menuStyle: React.CSSProperties = {
  textAlign: 'left',
  backgroundColor: 'inherit',
};

export const ActionMenu = () => {
  const [surveyModalOpen, setSurveyModalOpen] = useState(false);

  return (
    <>
      <Menu
        selectable={false}
        mode="vertical"
        style={menuStyle}
      >
        <Menu.Item
          key="start_form"
          icon={<EditOutlined />}
          onClick={() => setSurveyModalOpen(true)}
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

      <SurveyModal 
        open={surveyModalOpen} 
        onClose={() => setSurveyModalOpen(false)}
      />
    </>
  );
};