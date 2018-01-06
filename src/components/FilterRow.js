import React from "react";
import { Col, Row, Button, Select, InputNumber, Tag } from 'antd';
const Option = Select.Option;
const CheckableTag = Tag.CheckableTag;

const FilterRow = ((props) => {
    let element;
    if (props.filter.type == 'fieldsList') {
        element = (

            <Row gutter={10}>
                <Col span={4}>
                    <Select
                        size='small'
                        style={{ width: '100%' }}
                        placeholder='Field name'
                        onChange={(fieldNameValue) => props.onFilterChange({ fieldNameValue })}
                    >
                        {
                            Array.from(new Set(props.data.fields)).map((field, index) => {
                                return (
                                    <Option value={field.name} key={index}>{field.name}</Option>
                                )
                            })
                        }
                    </Select>
                </Col>
                {
                    props.filter.fieldName ?
                        (<Col span={2}>
                            <Select
                                size='small'
                                style={{ width: '100%', color: 'blue' }}
                                placeholder='Op'
                                onChange={(operatorValue) => props.onFilterChange({ operatorValue })}
                            >
                                {
                                    ['<', '>', '<=', '>=', '!=', '=='].map((op, index) => {
                                        return (
                                            <Option value={op} key={index}>{op}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </Col>)
                        : null
                }
                {
                    props.filter.operator ?
                        (
                            props.filter.values.map((value, fieldListIndex) => {
                                return value.type == 'boolean' ?
                                    (
                                        <Col span={2} key={fieldListIndex}>
                                            <Select
                                                size='small'
                                                style={{ width: '100%', color: 'blue', borderColor: 'blue' }}
                                                onChange={(fieldsListValue) => props.onFilterChange({ fieldsListValue, fieldListIndex })}
                                                defaultValue="OR"
                                            >
                                                {
                                                    ['OR', 'AND'].map((value, index) => {
                                                        return (<Option
                                                            value={value}
                                                            key={index}
                                                        >
                                                            {value}
                                                        </Option>)
                                                    })
                                                }
                                            </Select>

                                        </Col>

                                    ) : (
                                        props.processedData.barChart.metaData.labels.find((label) => label == props.filter.fieldName) ?
                                            (<Col span={3} key={fieldListIndex}>
                                                <Select
                                                    size='small'
                                                    style={{ width: '100%' }}
                                                    placeholder='Values'
                                                    onChange={(fieldsListValue) => props.onFilterChange({ fieldsListValue, fieldListIndex })}

                                                >
                                                    {
                                                        Array.from(new Set(props.processedData.barChart.fieldList.find((field) => field.field == props.filter.fieldName).values)).map((value, index) => {
                                                            return (<Option
                                                                value={value}
                                                                key={index}
                                                            >
                                                                {value}
                                                            </Option>)
                                                        })
                                                    }
                                                </Select>
                                            </Col>
                                            )
                                            :
                                            (
                                                <Col span={3} key={fieldListIndex}>
                                                    <InputNumber
                                                        size='small'
                                                        onChange={(fieldsListValue) => props.onFilterChange({ fieldsListValue, fieldListIndex })}
                                                    />
                                                </Col>
                                            )
                                    )
                            })

                        )
                        : null
                }
                <Col span={3}>
                    <Button
                        style={{marginRight: '0.5rem'}}
                        size='small'
                        shape="circle"
                        icon="plus"
                        onClick={() => props.onBarChartFilterslistChange({ action: 'add' })}
                    />
                    <Button
                        disabled={props.filter.values.length <= 0}
                        size='small'
                        shape="circle"
                        icon="minus"
                        onClick={() => props.onBarChartFilterslistChange({ action: 'delete' })}
                    />
                </Col>
            </Row>


        )
    }
    else if (props.filter.type == 'operator') {
        element = (
            <div style={{ margin: '0.8rem 0rem' }}>
                <Row gutter={10}>
                    <Col span={2}>
                        <Select
                            size='small'
                            style={{ width: '100%', color: 'blue', borderColor: 'blue' }}
                            onChange={(operatorValue) => props.onFilterChange({ operatorValue })}
                            defaultValue="AND"
                        >
                            {
                                ['OR', 'AND'].map((value, index) => {
                                    return (<Option
                                        value={value}
                                        key={index}
                                    >
                                        {value}
                                    </Option>)
                                })
                            }
                        </Select>

                    </Col>
                </Row>
            </div>
        )
    }
    return <div style={{ margin: '0.4rem 0rem' }}>{element}</div>;
})

export default FilterRow;