import React from 'react';
import { withRouter } from 'react-router-dom';
import { Icon } from 'antd';

const SpanLink = withRouter(({ history, url, onViewSwitch, ...props }) => (
    <span
        style={{ marginLeft: '0.5rem' }}
        onClick={() => {
            console.log(props);
            onViewSwitch(url, history);
        }}
    >
        <Icon type="link" />
    </span>
))

export default SpanLink;