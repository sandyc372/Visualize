import React from 'react';
import { Card, Col, Row, Icon } from 'antd';

const VizTypes = (props) => {


    return (
        <Row gutter={16}>
            {
                ['barChart', 'areaChart', 'pieChart', 'dotChart', 'lineChart', 'table', 'map'].map((type, index) => (
                    <Col span={3} key={index}>
                        <Card bordered={false}>
                            <Icon onClick={() => props.selectVizType(type)}
                                style={{ fontSize: 40, color: props.selectedViz == type ? '#08c' : 'grey' }}
                                type={type == 'map' ?  'global' : type.replace(/([a-z])([A-Z])/, (match, p1, p2) => p1 + '-' + p2.toLowerCase())} />
                        </Card>
                    </Col>
                ))
            }            
        </Row>
    )
}

export default VizTypes;