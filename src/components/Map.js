import React from "react";
import { ResponsiveContainer, Surface } from 'recharts';
import { geoMercator, geoPath } from "d3-geo"
import { feature, mesh } from 'topojson';
import { scaleLinear, scaleQuantize } from 'd3-scale';
const COLORS = ['#f9ddc7', '#fcc79e', '#fdb176', '#f19e51', '#e78a37', '#e0762e', '#d05c27', '#b93f22', '#9d2e12', '#7f2100']

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: feature(props.geoData, props.geoData.objects.polygons).features,
            path: null,
            projection: null,
            boundary: null,
            processedData: [],
            scale: scaleLinear()
        }

    }

    componentDidMount() {
        const { path, projection, boundary } = this.zoomAndCenter();
        const { processedData, scale } = this.processData();
        this.setState({
            path: path,
            projection: projection,
            boundary: boundary,
            processedData: processedData,
            scale: scale
        })
    }

    componentWillReceiveProps(nextProps) {
        let obj, processedData;

        if (nextProps.height && nextProps.width &&
            (nextProps.height != this.props.height || nextProps.width != this.props.height))
            obj = this.zoomAndCenter(nextProps.width, nextProps.height)

        if (nextProps.data && nextProps.fields &&
            (nextProps.data != this.props.data || nextProps.fields != this.props.fields))
            processedData = this.processData(nextProps.data, nextProps.fields);

        this.setState({
            path: obj ? obj.path : this.state.path,
            projection: obj ? obj.projection : this.state.projection,
            boundary: obj ? obj.boundary : this.state.boundary,
            processedData: processedData ? processedData.processedData : this.state.processedData,
            scale: processedData ? processedData.scale : this.state.scale
        })
    }

    processData = function (data = this.props.data, fields = this.props.fields) {
        let processedData = [];
        let scale = scaleLinear();

        if (fields && fields.stateField && fields.dataField && data) {
            console.log(fields.dataField, fields.stateField)
            data.forEach((datum) => {
                let found = processedData.find((pdata) => pdata.state == datum[fields.stateField])
                if (found)
                    found.value += isNaN(parseFloat(datum[fields.dataField])) ? 0 : parseFloat(datum[fields.dataField])
                else
                    processedData.push({
                        state: datum[fields.stateField],
                        value: isNaN(parseFloat(datum[fields.dataField])) ? 0 : parseFloat(datum[fields.dataField])
                    })
            })
        }
        console.log(processedData);
        if (processedData.length > 0) {
            let max = processedData.reduce((prev, curr) => (prev.value > curr.value) ? prev : curr)
            let min = processedData.reduce((prev, curr) => (prev.value < curr.value) ? prev : curr)
            scale = scaleQuantize().domain([min.value, max.value]).range(COLORS);
        }
        window.scale = scale; console.log(scale)
        return { processedData, scale };
    }

    zoomAndCenter = function (width = this.props.width, height = this.props.height) {

        const o = mesh(this.props.geoData, this.props.geoData.objects.polygons, function (a, b) { return a === b; });
        const projection = geoMercator();
        const path = geoPath().projection(projection).pointRadius(2)

        projection.scale(1).translate([0, 0]);

        const b = path.bounds(o),
            s = 1 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
            t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

        const p = projection
            .scale(s)
            .translate(t);

        return ({
            path: path,
            projection: projection,
            boundary: o
        })
    }

    render() {

        return (

            <Surface width={this.props.width} height={this.props.height}>
                <g className="states">
                    {
                        this.state.path ?
                            this.state.data.map((d, i) => {

                                let fill = `#ffffff`;
                                
                                if (this.state.processedData) {
                                    let found = this.state.processedData.find((datum) => datum.state.toLowerCase().trim() == d.properties.st_nm.toLowerCase().trim())
                                    console.log(found)
                                    if (found)
                                        fill = this.state.scale(found.value)
                                }
                                
                                console.log('fill', fill);
                                return <path
                                    key={`path-${i}`}
                                    d={this.state.path(d)}
                                    className="country"
                                    fill={fill}
                                    stroke="#3a403d"
                                    strokeWidth={0.5}
                                />
                            }) : null
                    }
                </g>
                <g className='outerBoundary'>
                    {
                        this.state.boundary ? (
                            <path
                                d={this.state.path(this.state.boundary)}
                                className="outerBoundary"
                                fill='none'
                                stroke="#3a403d"
                                strokeWidth={0.5}
                            />
                        ) : null
                    }
                </g>
                <g className="stateNames">
                    {
                        this.state.path ?
                            this.state.data.map((d, i) => (
                                <text
                                    key={`path-${i}`}
                                    transform={"translate(" + this.state.path.centroid(d) + ")"}
                                    className="stateNames"
                                    dy=".35em"
                                    textAnchor="middle"
                                    fontSize="0.6rem"
                                    textshadow="0px 0px 2px #fff"
                                >
                                    {d.properties.st_nm.toUpperCase()}
                                </text>
                            )) : null
                    }
                </g>

            </Surface>

        )

    }

}

export default Map;