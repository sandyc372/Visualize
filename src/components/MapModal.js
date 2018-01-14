import React from 'react';
import { Layout, Menu, Modal, Col, Row, Button, Select } from 'antd';
const Option = Select.Option;

const MapModal = (props) => {
    return (
        <Modal
            title="Map settings"
            visible={props.visible}
            onOk={() => {
                props.onModalOk();
            }}
            onCancel={() => {
                props.onModalCancel();
            }}
        >
            <div style={{ margin: '0.4rem 0rem' }}>

                <Row gutter={24}>
                    <Col span={2}>
                        State
                     </Col>

                    <Col span={10}>
                        <Select
                            size='small'
                            style={{ width: '100%' }}
                            placeholder='Select state field'
                            defaultValue={props.processedData.map ? props.processedData.map.stateField : null}
                            onChange={(stateField) => { props.onMapFieldChange({stateField}) }}
                        >
                            {
                                props.data ?
                                    Array.from(new Set(props.data.fields)).map((field, index) => {
                                        return (
                                            <Option value={field.name} key={index}>{field.name}</Option>
                                        )
                                    })
                                    : null
                            }
                        </Select>
                    </Col>
                    <Col span={2}>
                        Data
                     </Col>

                    <Col span={10}>
                        <Select
                            size='small'
                            style={{ width: '100%' }}
                            placeholder='Select data field'
                            defaultValue={props.processedData.map ? props.processedData.map.dataField : null}
                            onChange={(dataField) => { props.onMapFieldChange({dataField}) }}
                        >
                            {
                                props.data ?
                                    Array.from(new Set(props.data.fields)).map((field, index) => {
                                        return (
                                            <Option value={field.name} key={index}>{field.name}</Option>
                                        )
                                    })
                                    : null
                            }
                        </Select>
                    </Col>
                </Row>
            </div>
        </Modal>
    )

}
export default MapModal;