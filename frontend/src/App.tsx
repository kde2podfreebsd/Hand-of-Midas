import { Flex, Layout } from 'antd';
import { useContext } from 'react';
import { Menu } from './components/Menu/Menu';
import { PAGE_CONTENT, PAGE_HEADER } from './constants/pages';
import { PageContext } from './providers/PageProvider';

import "@suiet/wallet-kit/style.css";
import './index.css';

const contentStyle: React.CSSProperties = {
  minHeight: 120,
  backgroundColor: '#fff',
};

const siderStyle: React.CSSProperties = {
  backgroundColor: '#fafafc',
};

const headerStyle: React.CSSProperties = {
  padding: 0,
  height: '7vh',
};

const layoutStyle: React.CSSProperties = {
  position: 'absolute',
  backgroundColor: '#FFF',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};



const App = () => {
  const { page } = useContext(PageContext);
  const Page = PAGE_CONTENT[page];

  return (
    <Flex wrap>
      <Layout style={layoutStyle}>
        <Layout.Sider width="20%" style={siderStyle}>
          <Menu/>
        </Layout.Sider>
        <Layout>
          <Layout.Header style={headerStyle}>
            <Flex
              style={{
                width: '100$',
                height: '100%',
                backgroundColor: 'white',
                paddingLeft: 20,
                margin: 0,
              }}
              justify='flex-start'
              align='center'
            >
              <h3>{PAGE_HEADER[page]}</h3>
            </Flex>
          </Layout.Header>
          <Layout.Content style={contentStyle}>
            <Page />
          </Layout.Content>
        </Layout>
      </Layout>
    </Flex>
  )
};

export default App;