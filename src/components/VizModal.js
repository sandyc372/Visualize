import React from "react";
import { Layout, Menu, Modal, Icon, Card, Col, Row, Button, Select, InputNumber, Slider } from 'antd';
import FilterGrid from '../components/FilterGrid';
const Option = Select.Option;

const VizModal = (props) => {

    return (
        <Modal
            title="Viz settings"
            visible={props.visible}
            onOk={() => {
                props.onModalOk();
            }}
            onCancel={() => {
                props.onModalCancel();
            }}
            width={1200}
        >
            <div style={{ margin: '0.4rem 0rem' }}>
           
                <Row gutter={24}>
                    <Col span={2}>
                        Category
                    </Col>
                    <Col span={8}>
                        <Select
                            defaultValue={props.processedData.barChart ? props.processedData.barChart.dataKey.xAxis : null}
                            style={{ width: '100%' }}
                            onChange={(value) => {
                                props.onBarChartXaxisChange(value);
                            }}
                        >
                            {
                                props.data ? Array.from(new Set(props.processedData.barChart.metaData.labels)).map((field, index) => {
                                    return (
                                        <Option

                                            value={field}
                                            key={index}>{field}</Option>
                                    )
                                }) : null
                            }
                        </Select>
                    </Col>
                    <Col span={2}>
                        Layout
                    </Col>
                    <Col span={5}>
                        <Select
                            defaultValue={props.processedData.barChart ? props.processedData.barChart.options.layout : null}
                            style={{ width: '100%' }}
                            onChange={(value) => {
                                props.onBarChartLayoutChange(value.toLowerCase());
                            }}
                        >
                            {
                                ['Horizontal', 'Vertical'].map((field, index) => {
                                    return (
                                        <Option

                                            value={field}
                                            key={index}>{field}</Option>
                                    )
                                })
                            }
                        </Select>
                    </Col>
                    <Col span={2}>
                        Range
                    </Col>
                    <Col span={5}>
                    <Slider range 
                    defaultValue={[1, props.processedData.barChart.filterFunction(props.processedData.barChart.data).length]} 
                    min={
                        1
                    }
                    max={
                        props.processedData.barChart.filterFunction(props.processedData.barChart.data).length
                    }
                    onChange={(value) => props.onRowSliderOnChange(value)}
                    />
                    </Col>
                </Row>
            </div>

            <div style={{ margin: '0.4rem 0rem' }}>
                <Row>
                    <Col span={2}>
                        Fields
                </Col>
                    <Col span={22}>
                        <Select
                            mode='multiple'
                            defaultValue={props.processedData.barChart ? props.processedData.barChart.dataKey.bars : null}
                            style={{ width: '100%' }}
                            onDeselect={(value) => {
                                props.onBarChartFieldDeselect(value);
                            }}
                            onSelect={(value) => {
                                props.onBarChartFieldSelect(value);
                            }}
                        >
                            {
                                props.data ? Array.from(new Set(props.processedData.barChart.metaData.magnitudes)).map((field, index) => {
                                    return (
                                        <Option

                                            value={field}
                                            key={index}>{field}</Option>
                                    )
                                }) : null
                            }
                        </Select>
                    </Col>
                </Row>
            </div>
            <div style={{ margin: '0.4rem 0rem' }}>
                <Row>
                    <Col span={2}>
                        Row-filters
                </Col>
                    <Col span={22}>
                        {
                            props.processedData.barChart ?
                                <FilterGrid
                                    data={props.data}
                                    processedData={props.processedData}
                                    onFilterChange={(obj) => props.onFilterChange(obj)}
                                    onBarChartFilterslistChange={(obj) => { props.onBarChartFilterslistChange(obj) }}
                                    applyFilters={(obj) => {props.applyFilters(obj)}}
                                    removeFilters={(obj) => {props.removeFilters(obj)}}
                                /> :
                                null
                        }
                    </Col>
                </Row>
            </div>

        </Modal>
    )
}

export default VizModal;