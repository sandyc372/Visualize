import React from "react";
import styles from './styles';
import { Layout, Menu, Breadcrumb, Icon, Card, Col, Row, Pagination } from 'antd';
import CatalogCard from '../../components/CatalogCard';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const { Meta } = Card;


class Catalog extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.onInit();
    }
    render() {
        return (
            <Layout>
                <Header style={{ background: '#fff', paddingLeft: '2rem', fontSize: '1.5rem' }} >
                    Catalogs (Page {this.props.metadata['Current-Page']} of {this.props.metadata['Total-Number-Of-Page']})
                </Header>
                <Content style={{ margin: '0 16px' }}>

                    {this.props.data.map((item, index) => {
                        return (
                            <CatalogCard 
                                key={index}
                                data={item}
                                fetching={this.props.fetching}
                                onDatasetViewSwitch={ (url, history) => this.props.onDatasetViewSwitch(url, history) }
                            />
                        )
                    })}

                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    <Pagination
                        showQuickJumper
                        defaultPageSize={20}
                        defaultCurrent={+this.props.page}
                        total={+this.props.metadata['Total-Number-Of-Catalog']}
                        onChange={(page, pageSize) => {this.props.onPageChange(page, pageSize) }} />
                </Footer>
            </Layout>
        )
    }

}
export default Catalog; 