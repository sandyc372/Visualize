import React from "react";
import { ResponsiveContainer, Surface } from 'recharts';
import { geoMercator, geoPath } from "d3-geo"
import { feature, mesh } from 'topojson';

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: feature(props.geoData, props.geoData.objects.polygons).features,
            path: geoPath(),
            projection: geoMercator()
        }
       
    }

    componentDidMount(){
        this.zoomAndCenter();
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.height != this.props.height || nextProps.width != this.props.height)
            this.zoomAndCenter(nextProps.width, nextProps.height)
    }

    zoomAndCenter = function(width = this.props.width, height = this.state.height){
        
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

        this.setState({
            path: path,
            projection: projection
        })
    }

    render() {

        console.log(this.state.data)
        return (

            <Surface width={this.props.width} height={this.props.height}>
                <g className="states">
                    {
                        this.state.data.map((d, i) => (
                            <path
                                key={`path-${i}`}
                                d={this.state.path(d)}
                                className="country"
                                fill={`rgba(38,50,56,${1 / this.state.data.length * i})`}
                                stroke="#FFFFFF"
                                strokeWidth={0.5}
                            />
                        ))
                    }
                </g>

            </Surface>

        )

    }

}

export default Map;