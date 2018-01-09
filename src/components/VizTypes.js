import React from 'react';
import { Card, Col, Row, Icon } from 'antd';

const VizTypes = (props) => {
    return (
        <Row gutter={16}>
            <Col span={4}>
                <Card bordered={false}>
                    <Icon style={{ fontSize: 40, color: '#08c' }} type="bar-chart" />
                </Card>
            </Col>
            <Col span={4}>
                <Card bordered={false}>
                    <Icon style={{ fontSize: 40, color: '#08c' }} type="area-chart" />
                </Card>
            </Col>
            <Col span={4}>
                <Card bordered={false}>
                    <Icon style={{ fontSize: 40, color: '#08c' }} type="pie-chart" />
                </Card>
            </Col>
            <Col span={4}>
                <Card bordered={false}>
                    <Icon style={{ fontSize: 40, color: '#08c' }} type="dot-chart" />
                </Card>
            </Col>
           
            <Col span={4}>
                <Card bordered={false}>
                    <Icon style={{ fontSize: 40, color: '#08c' }} type="line-chart" />
                </Card>
            </Col>
            <Col span={4}>
                <Card bordered={false}>
                    <Icon style={{ fontSize: 40, color: '#08c' }} type="table" />
                </Card>
            </Col>
        </Row>
    )
}

export default VizTypes;