import React from 'react';
import styles from './styles';
import { Card, Col, Row, Button, Icon } from 'antd';
import SpanLink from '../SpanLink';
const { Meta } = Card;


class CatalogCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            truncateLength: 200
        }
    }

    render() {
        return (
            <div className='catalog-card' style={styles.catalogCard}>
                <Row>
                    <Col span={24} >
                        <Card title={this.props.data.Title}
                            loading={this.props.fetching}
                            hoverable
                            bordered={true}
                        >
                            <div style={{ marginBottom: '1rem' }}>
                                {this.props.data.Description.length < this.state.truncateLength || !this.state.collapsed ?
                                    this.props.data.Description : this.props.data.Description.substr(0, this.state.truncateLength) + '...'
                                }

                                {
                                    this.props.data.Description.length > this.state.truncateLength ?
                                        <span
                                            style={styles.collapseToggle}
                                            onClick={() => {
                                                this.setState({
                                                    collapsed: !this.state.collapsed
                                                })
                                            }}
                                        >
                                            {this.state.collapsed ? '[More]' : '[Less]'}
                                        </span> : null
                                }
                                <SpanLink 
                                    url={this.props.data.URL}
                                    onViewSwitch={(url, history) => this.props.onDatasetViewSwitch(url, history)}
                                    />
                            </div>
                            <Meta
                                description={'- ' + this.props.data['Ministry-Department']}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default CatalogCard; 