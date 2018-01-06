import React from 'react';
import styles from './styles';
import { Card, Col, Row, Button, Icon, Divider } from 'antd';
import SpanLink from '../SpanLink';
const { Meta } = Card;

class DatasetCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            truncateLength: 50
        }
    }

    /*
    * Function: Removes camelcasing
    * Returns: humanized string
    */
    humanize = function (str) {
        return str.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })
    }

    render() {
        return (
            <div className='dataset-card' style={styles.datasetCard}>
                <Card
                    title={'Dataset ' + this.props.number}
                    loading={this.props.fetching}
                    hoverable
                    bordered={true}
                >
                    {
                        (() => {
                            let list = [];
                            const api = this.props.data.api ?
                                <SpanLink
                                    url={this.props.data.api}
                                    onViewSwitch={(url, history) => {this.props.onVizViewSwitch(url, history)}}
                                /> : <Icon type="frown" />

                            const title =
                                <span>
                                    {this.props.data.title.length <= this.state.truncateLength || !this.state.collapsed ?
                                        this.props.data.title : this.props.data.title.substr(0, this.state.truncateLength) + '...'
                                    }

                                    {
                                        this.props.data.title.length > this.state.truncateLength ?
                                            <span
                                                style={styles.collapseToggle}
                                                onClick={() => {
                                                    this.setState({
                                                        collapsed: !this.state.collapsed
                                                    })
                                                }}
                                            >
                                                {this.state.collapsed ? '[+]' : '[-]'}
                                            </span> : null
                                    }
                                </span>;


                            for (const property in this.props.data) {
                                list.push(
                                    <Row gutter={8} key={list.length}>
                                        <Col span={8}>
                                            {this.humanize(property)}
                                        </Col>
                                        <Col span={16}>
                                            {
                                                property == 'title' ?
                                                    title :
                                                    property == 'api' ?
                                                        api : this.props.data[property]
                                            }
                                        </Col>
                                    </Row>
                                )
                                list.push(<Divider key={list.length} />)
                            }
                            return list;
                        })()
                    }

                </Card>
            </div>
        )
    }
}

export default DatasetCard;