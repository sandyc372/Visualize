import React from "react";
import styles from './styles';
import { Layout, Menu, Modal, Icon, Card, Col, Row, Button, Select, Popover } from 'antd';
import VizModal from '../../components/VizModal';
import VizTypes from '../../components/VizTypes';
import Map from '../../components/Map';
import cheerio from 'cheerio';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import COMMONS from '../../commons';
import checkProperties from '../../utilities/checkProperties';
import parser from '../../utilities/parser';
import indiaStatesData from '../../utilities/indiaStatesData';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const { Meta } = Card;
const Option = Select.Option;
const COLORS = ['#e6194b', '#3cb44b', '#ffe119', '#0082c8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#d2f53c', '#fabebe', '#008080', '#e6beff', '#aa6e28', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000080', '#808080', '#FFFFFF', '#000000']

class Viz extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            vizModalVisible: false,
            apiModalVisible: false,
            data: null,
            apiUrl: null,
            limit: 10,
            offset: 0,
            filters: '',
            fields: '',
            sort: '',
            fetching: true,
            selectedViz: 'map',
            processedData: {
                barChart: null,
            }
        }
    }
    componentDidMount() {
        this.fetchData();
    }

    getApiUrl = function (url,
        limit = this.state.limit,
        offset = this.state.offset,
        filters = this.state.filters,
        fields = this.state.fields,
        sort = this.state.sort) {
        return (
            url +
            '&limit=' + limit +
            '&offset=' + offset +
            '&filters=' + filters +
            '&fields=' + fields +
            '&sort=' + sort
        )
    }

    fetchData = function () {
        this.setState({
            fetching: true
        })

        fetch(this.props.data.url)
            .then((response) => response.text())
            .then((result) => {
                let $ = cheerio.load(result);
                let collection = $('a');
                for (let i = 0; i < collection.length; i++) {
                    try {
                        let href = $(collection[i]).attr('href');
                        if (href.startsWith('https://api.data.gov.in')) {
                            href = href.replace('YOURKEY', COMMONS.key);

                            fetch(this.getApiUrl(href))
                                .then((response) => response.json())
                                .then((result) => {
                                    this.setState({
                                        data: result,
                                        apiUrl: href,
                                        processedData: this.processData(result),
                                        fetching: false
                                    })
                                })
                            break;
                        }

                    }
                    catch (err) {
                        console.log(err)
                    }
                }

            })
    }

    processData = function (data, type = 'barChart') {

        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        if (type == 'barChart') {
            let barChart = {
                metaData: {
                    labels: [],
                    magnitudes: []
                },
                fieldList: []
            };
            data.fields.forEach(function (field) {
                let arr = data.records.map(function (record) {
                    return record[field.name]
                })
                let isNumber = arr.every(function (element) {
                    if (element.toLowerCase() == 'na') return true;
                    return isNumeric(element);
                })
                if (isNumber)
                    barChart.metaData.magnitudes.push(field.name);
                else
                    barChart.metaData.labels.push(field.name);
                barChart.fieldList.push({
                    field: field.name,
                    values: arr
                })
            })

            //Clean the data before setting
            let newBarChartData = data.records.map(function (record) {
                let obj = {};
                for (const property in record) {
                    if (barChart.metaData.magnitudes.find((magnitude) => property == magnitude))
                        if (!isNumeric(record[property]))
                            obj[property] = 0;
                        else
                            obj[property] = +record[property];
                    else
                        obj[property] = record[property]
                }
                return obj;
            });

            barChart.data = newBarChartData;
            barChart.dataKey = {
                xAxis: barChart.metaData.labels[0],
                bars: [barChart.metaData.magnitudes[0]]
            }
            barChart.options = {
                layout: 'horizontal',
                filters: []
            }
            barChart.filterFunction = (data) => data;
            barChart.slicingFunction = (data) => data.slice(0);
            console.log(barChart);
            barChart.error = this.checkDataErrors({ barChart })
            let newProcessedData = { ...this.state.processedData, barChart: barChart };
            return newProcessedData;
        }
    }

    checkDataErrors = function ({ barChart, pieChart }) {
        if (barChart) {
            return !(barChart.metaData.labels.length > 0 &&
                barChart.metaData.magnitudes.length > 0 &&
                barChart.dataKey.xAxis && typeof barChart.dataKey.xAxis == 'string' &&
                barChart.dataKey.bars.every((bar) => typeof bar == 'string' ? true : false))
        }
    }
    applyFilters = function ({ on }) {
        if (on == 'barChart') {
            var filterStr = "";
            var expected = 'fieldsList';
            if (!this.state.processedData.barChart) return;
            const filters = this.state.processedData.barChart.options.filters;
            console.log(filters);
            filters.forEach((filter) => {
                if (filter.type != expected) return;
                if (filter.type == 'fieldsList') {

                    if (typeof filter.fieldName != 'string' ||
                        typeof filter.operator != 'string' ||
                        !Array.isArray(filter.values) ||
                        filter.values.length < 1
                    ) return;

                    let filterListStr = filter.values.reduce((acc, cur) => {
                        if (cur.type == 'boolean') return acc + ' ' + cur.value;
                        else if (cur.type == 'fieldValue')
                            return acc + ' ' + filter.fieldName + ' ' + filter.operator + ' ' + "'" + cur.value + "'";
                        else return acc;
                    }, '(') + ' )';

                    filterStr = filterStr + ' ' + filterListStr

                }
                if (filter.type == 'operator') {
                    filterStr = filterStr + ' ' + filter.value || 'OR';
                }
                expected = expected == 'fieldsList' ? 'operator' : 'fieldsList';
            })

            filterStr = filterStr.trim();
            console.log(filterStr);
            try {
                let filterFunction = new Function('obj', 'checkProperties', parser.parse(filterStr));
                this.setState({
                    ...this.state,
                    processedData: {
                        ...this.state.processedData,
                        barChart: {
                            ...this.state.processedData.barChart,
                            filterFunction: (data) => {
                                let filteredData = [];
                                data.forEach((datum) => {
                                    if (filterFunction(datum, checkProperties))
                                        filteredData.push(datum);
                                })
                                return filteredData;
                            }
                        }

                    }
                })
            }
            catch (err) {
                console.log('parsing failed with err: ', err);
            }
        }
    }

    removeFilters = function ({ on }) {
        if (on == 'barChart') {
            this.setState({
                ...this.state,
                processedData: {
                    ...this.state.processedData,
                    barChart: {
                        ...this.state.processedData.barChart,
                        filterFunction: (data) => data,
                        options: {
                            ...this.state.processedData.barChart.options,
                            filters: []
                        }
                    }

                }
            })

        }
    }

    handleRowSliderOnChange = function (value) {
        console.log(value)
        if (value.length == 2) {
            this.setState({
                ...this.state,
                processedData: {
                    ...this.state.processedData,
                    barChart: {
                        ...this.state.processedData.barChart,
                        slicingFunction: (data) => data.slice(value[0] - 1, value[1])
                    }

                }
            })
        }
    }

    handleFilterChange = function ({ fieldNameValue,
        operatorValue,
        fieldsListValue,
        index,
        fieldListIndex }) {

        let newFilters = this.state.processedData.barChart.options.filters.slice();
        if (fieldNameValue)
            newFilters[index].fieldName = fieldNameValue;

        if (operatorValue)
            newFilters[index].operator = operatorValue;

        if (fieldsListValue)
            newFilters[index].values[fieldListIndex].value = fieldsListValue;

        console.log(newFilters);

        this.setState({
            ...this.state,
            processedData: {
                ...this.state.processedData,
                barChart: {
                    ...this.state.processedData.barChart,
                    options: {
                        ...this.state.processedData.barChart.options,
                        filters: newFilters
                    }
                }

            }
        })
    }
    handleBarChartXxisChange = function (value) {
        /*
        * Todo: processing the change
        */
        console.log('handled change', value)
        this.setState({
            ...this.state,
            processedData: {
                ...this.state.processedData,
                barChart: {
                    ...this.state.processedData.barChart,
                    dataKey: {
                        ...this.state.processedData.barChart.dataKey,
                        xAxis: value
                    }
                }

            }
        })
    }

    handleModalOk = function () {
        this.setState({
            vizModalVisible: false
        })
    }

    handleModalCancel = function () {
        this.setState({
            vizModalVisible: false
        })
    }
    handleBarChartFieldDeselect = function (value) {
        console.log('deselected')
        let newBars = this.state.processedData.barChart.dataKey.bars.slice();
        newBars.splice(newBars.indexOf(value), 1);
        this.setState({
            ...this.state,
            processedData: {
                ...this.state.processedData,
                barChart: {
                    ...this.state.processedData.barChart,
                    dataKey: {
                        ...this.state.processedData.barChart.dataKey,
                        bars: newBars
                    }
                }

            }
        })
    }
    handleBarChartFieldSelect = function (value) {
        /*
         * Todo: processing the change
        */

        let newBars = this.state.processedData.barChart.dataKey.bars.slice();
        newBars.push(value)
        this.setState({
            ...this.state,
            processedData: {
                ...this.state.processedData,
                barChart: {
                    ...this.state.processedData.barChart,
                    dataKey: {
                        ...this.state.processedData.barChart.dataKey,
                        bars: newBars
                    }
                }

            }
        })
    }
    handleBarChartLayoutChange = function (layout) {
        this.setState({
            ...this.state,
            processedData: {
                ...this.state.processedData,
                barChart: {
                    ...this.state.processedData.barChart,
                    options: {
                        ...this.state.processedData.barChart.options,
                        layout: layout
                    }
                }

            }
        })
    }
    handleBarChartFilterslistChange = function ({ action, index, fieldsListIndex, type }) {

        let newFilters = this.state.processedData.barChart.options.filters.slice();

        if (action == 'add') {
            if (type == 'newFilter') {

                newFilters.length > 0 ?
                    newFilters.push({
                        type: 'operator',
                        value: 'AND'
                    }) : null;

                newFilters.push({
                    type: 'fieldsList',
                    fieldName: null,
                    operator: null,
                    values: [{
                        type: 'fieldValue',
                        value: null
                    }]
                })
            }
            else {
                newFilters[index].values.length > 0 ?
                    newFilters[index].values.push(
                        {
                            type: 'boolean',
                            value: 'OR'
                        }
                    ) : null;
                newFilters[index].values.push(
                    {
                        type: 'fieldValue',
                        value: null
                    }
                )

            }

        }
        else if (action == 'delete') {
            if (type == 'oldFilter') {
                newFilters.length > 1 ?
                    newFilters.splice(newFilters.length - 2)
                    :
                    newFilters.splice(newFilters.length - 1)
            }
            else
                newFilters[index].values.length > 1 ?
                    newFilters[index].values.splice(newFilters[index].values.length - 2)
                    :
                    newFilters[index].values.splice(newFilters[index].values.length - 1)
        }
        console.log(newFilters);

        this.setState({
            ...this.state,
            processedData: {
                ...this.state.processedData,
                barChart: {
                    ...this.state.processedData.barChart,
                    options: {
                        ...this.state.processedData.barChart.options,
                        filters: newFilters
                    }
                }

            }
        })
    }
    render() {
        return (
            <Layout>
                <Content style={{ margin: '0 16px' }}>
                    <Row>
                        <Col span={24}>
                            <div className='viz-card' style={styles.vizCard}>
                                {
                                    this.state.processedData.barChart
                                        && this.state.processedData.barChart.error == false ?
                                        <VizModal
                                            visible={this.state.vizModalVisible}
                                            onModalOk={() => this.handleModalOk()}
                                            onModalCancel={() => this.handleModalCancel()}
                                            onBarChartXaxisChange={(value) => this.handleBarChartXxisChange(value)}
                                            onBarChartFieldDeselect={(value) => this.handleBarChartFieldDeselect(value)}
                                            onBarChartFieldSelect={(value) => this.handleBarChartFieldSelect(value)}
                                            onFilterChange={(obj) => this.handleFilterChange(obj)}
                                            onBarChartFilterslistChange={(obj) => { this.handleBarChartFilterslistChange(obj) }}
                                            onBarChartLayoutChange={(layout) => this.handleBarChartLayoutChange(layout)}
                                            data={this.state.data}
                                            processedData={this.state.processedData}
                                            applyFilters={(obj) => { this.applyFilters(obj) }}
                                            removeFilters={(obj) => { this.removeFilters(obj) }}
                                            onRowSliderOnChange={(value) => this.handleRowSliderOnChange(value)}
                                        /> : null

                                }

                                <Card
                                    title={this.props.data.title}
                                    loading={this.state.fetching}
                                    hoverable
                                    bordered={true}
                                    actions={[<Button shape="circle" icon="setting" onClick={() => {
                                        this.setState({
                                            vizModalVisible: true
                                        })
                                    }} />,

                                    <Popover content={<VizTypes />} trigger="click">
                                        <Button shape="circle" icon="ellipsis" />
                                    </Popover>,
                                    <Icon type="filter" />
                                    ]}
                                >

                                    {
                                        this.state.selectedViz == 'barChart' ?
                                            this.state.processedData.barChart ?
                                                this.state.processedData.barChart.error == false ?
                                                    <ResponsiveContainer width='100%' height={480}>
                                                        <BarChart
                                                            layout={this.state.processedData.barChart.options.layout}
                                                            data={
                                                                this.state.processedData.barChart.slicingFunction(
                                                                    this.state.processedData.barChart.filterFunction(
                                                                        this.state.processedData.barChart.data
                                                                    ))
                                                            }>
                                                            <CartesianGrid strokeDasharray="3 3" />

                                                            <XAxis
                                                                dataKey={
                                                                    this.state.processedData.barChart.options.layout == 'horizontal' ?
                                                                        this.state.processedData.barChart.dataKey.xAxis : null
                                                                }
                                                                type={
                                                                    this.state.processedData.barChart.options.layout == 'horizontal' ?
                                                                        'category' : 'number'
                                                                }
                                                            />

                                                            <YAxis
                                                                dataKey={
                                                                    this.state.processedData.barChart.options.layout == 'vertical' ?
                                                                        this.state.processedData.barChart.dataKey.xAxis : null
                                                                }
                                                                type={
                                                                    this.state.processedData.barChart.options.layout == 'vertical' ?
                                                                        'category' : 'number'
                                                                }
                                                            />
                                                            <Tooltip />
                                                            <Legend />
                                                            {
                                                                this.state.processedData.barChart.dataKey.bars.map((bar, index) => {
                                                                    return (
                                                                        <Bar dataKey={bar} key={bar} fill={COLORS[index]} ></Bar>
                                                                    )
                                                                })
                                                            }

                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                    : <Card title="Error!">
                                                        This type of data is unsuitable for {this.state.selectedViz} viz.
                                                        Please Select another view.
                                                    </Card>
                                                : null
                                            : this.state.selectedViz == 'map' ?
                                                <ResponsiveContainer width='100%' height={480}>
                                                    <Map
                                                        geoData={indiaStatesData}
                                                    />
                                                </ResponsiveContainer>
                                                : null
                                    }

                                </Card>
                            </div>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        )
    }
}
export default Viz;