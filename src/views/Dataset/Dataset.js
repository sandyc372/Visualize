import React from "react";
import styles from './styles';
import { Layout, Menu, Breadcrumb, Icon, Card, Col, Row, Pagination } from 'antd';
import cheerio from 'cheerio';
import DatasetCard from '../../components/DatasetCard';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const { Meta } = Card;


class Dataset extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: '1',
            totalPages: 0,
            title: '',
            fileShortFormat: '',
            data: [],
            fetching: true,
            itemsPerPage: 6
        }
    }
    
    componentDidMount() {
        this.fetchDatasets(this.props.data.url, this.props.data.page);
    }

    /*
    * Function: Builds the corect dataset url
    * Returns: String
    */
    getDatasetUrl = function (url, page = this.state.page) {
        return (
            url
            + '?'
            + 'title=' + this.state.title
            + '&file_short_format=' + this.state.fileShortFormat
            + '&page=' + (page - 1)
        )
    }

    fetchDatasets = function (url, page) {
        this.setState({
            fetching: true
        })

        fetch(this.getDatasetUrl(url, page))
            .then((response) => { return response.text() })
            .then((result) => {
                let {data, totalPages} = this.parseHtmlResponse(result);

                //setState
                this.setState({
                    data: data,
                    fetching: false,
                    page: page,
                    totalPages: totalPages
                })
            })
            .catch((response) => console.log('Thats an Error!', response))
    }

    handlePageChange = function (page, pageSize) {
        this.fetchDatasets(this.props.data.url, page);
    }

    parseHtmlResponse = function (htmlResponse) {
        var data = [], totalPages;
        let $ = cheerio.load(htmlResponse);
        let datasets = $('div.views-row.ogpl-grid-list');
        Array.prototype.forEach.call(datasets, function (dataset) {
            try {
                let title = $(dataset).find('span.title-content').text().trim();
                let granularity = $(dataset).find('.views-field-field-granularity .field-content').text().trim();
                let fileSize = $(dataset).find('span.download-filesize').text().split(':')[1].trim();
                let downloads = $(dataset).find('span.download-counts').text().split(':')[1].trim();
                let api;
                try {
                    api = $(dataset).find('a.api-link').attr('href');
                }
                catch (err) {
                    api = null
                }

                //Cleanup before pushing
                title = title.length > 0 ? title : '';
                granularity = granularity.length > 0 ? granularity : '';
                fileSize = fileSize.length > 0 ? fileSize : '';
                downloads = downloads.length > 0 ? downloads : '';

                //Push
                data.push({
                    title: title,
                    granularity: granularity,
                    fileSize: fileSize,
                    downloads: downloads,
                    api: api || null
                })

            }
            catch (err) {
                console.log(err);
            }
        });

        //Calculate total pages for the first time
        if (this.state.totalPages == 0) {
            try {
                let lastPage = $('ul.pager li.pager-last.last a').attr('href')
                    .match(/page=([0-9]+)/i);
                console.log(+lastPage[1])
                totalPages = +lastPage[1]+1
                
            }
            catch (err) {
                console.log(err);
                totalPages = 1
            }
        }
        else totalPages = this.state.totalPages;
        
        console.log({data, totalPages});
        return {data, totalPages};
    }
    render() {
        return (
            <Layout>
                <Header style={{ background: '#fff', paddingLeft: '2rem', fontSize: '1.5rem' }} >
                    Dataset (Page {this.state.page} of {this.state.totalPages})
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Row gutter={16}>
                        {this.state.data.map((item, index) => {
                            return (
                                <Col span={8} key={index} >
                                    <DatasetCard
                                        data={item}
                                        number={(this.state.page-1)*this.state.itemsPerPage + (index+1)}
                                        fetching={this.state.fetching}
                                        onVizViewSwitch={(url, history) => {this.props.onVizViewSwitch(url, history, this.state.page, item.title)}}
                                    />
                                </Col>
                            )
                        })}
                    </Row>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    <Pagination
                        showQuickJumper
                        defaultPageSize={6}
                        defaultCurrent={+this.props.data.page}
                        total={+this.state.totalPages * this.state.itemsPerPage}
                        onChange={(page, pageSize) => { this.handlePageChange(page, pageSize) }} />

                </Footer>
            </Layout>
        )
    }

}
export default Dataset; 