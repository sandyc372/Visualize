import React from "react";
import { Col, Row, Button, Select, InputNumber } from 'antd';
import FilterRow from '../components/FilterRow';
const Option = Select.Option;

const FilterGrid = ((props) => {
    return (
        <div>
            <div style={{ margin: '0.4rem 0rem' }}>
                {
                    props.processedData.barChart.options.filters.map((filter, index) => {
                        return (
                            <FilterRow
                                key={index}
                                data={props.data}
                                processedData={props.processedData}
                                filter={filter}
                                onFilterChange={(obj) => props.onFilterChange({ ...obj, index: index })}
                                onBarChartFilterslistChange={(obj) => { props.onBarChartFilterslistChange({ ...obj, index: index }) }}
                            />

                        )
                    })
                }
            </div>
            <div style={{ margin: '0.4rem 0rem' }}>
                <Row>
                    <Col span={3}>
                        <Button
                            style={{marginRight: '0.5rem'}}
                            size='small'
                            shape="circle"
                            icon="plus"
                            onClick={() => props.onBarChartFilterslistChange({ action: 'add', type: 'newFilter' })}
                        />
                        <Button
                            style={{marginRight: '0.5rem'}}
                            disabled={props.processedData.barChart.options.filters.length <= 0}
                            size='small'
                            shape="circle"
                            icon="minus"
                            onClick={() => props.onBarChartFilterslistChange({ action: 'delete', type: 'oldFilter' })}
                        />
                        <Button
                            type='primary'
                            style={{marginRight: '0.5rem'}}
                            disabled={props.processedData.barChart.options.filters.length <= 0}
                            size='small'
                            shape="circle"
                            icon="filter"
                            onClick={ () => {props.applyFilters({on: 'barChart'})} }
                        />
                        <Button
                            type='danger'
                            style={{marginRight: '0.5rem'}}
                            size='small'
                            shape="circle"
                            icon="delete"
                            onClick={ () => {props.removeFilters({on: 'barChart'})} }
                        />
                    </Col>

                </Row>
            </div>
        </div>
    )
})

export default FilterGrid;