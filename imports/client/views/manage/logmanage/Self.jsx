import React from 'react';
import { Form, Modal, Row } from 'antd';
import PropTypes from 'prop-types';
import CardLog from './component/CardLog';


class Tab1 extends (React.PureComponent || React.Component) {
    constructor(props) {
        super(props);
        this.state = {
            logType: 'day',
            expand: false,
            templates: [
                { name: 'day', value: '日报' },
                { name: 'week', value: '周报' },
                { name: 'month', value: '月报' },
                { name: 'business', value: '营业日报' },
            ],
            template: [],
        };
    }
    componentWillMount() {
        this.setState({ template: this.state.templates.slice(0, 2) });
    }
    tabsubmit = (e) => {
        e.preventDefault();
        const { form, tab1Submit } = this.props;
        tab1Submit(form.getFieldsValue());
    }
    // 日报， 周报切换
    handleLogChange = (e) => {
        const _this = this;
        Modal.confirm({
            title: '温馨提示',
            content: '您尚未保存，确定要离开？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => { _this.setState({ logType: e.target.value }); },
        });
    }
    // more
    moreChange = () => {
        const { expand } = this.state;
        const template = expand ? this.state.templates.slice(0, 2) : this.state.templates.slice(0);
        this.setState({ expand: !expand, template });
    }
    render() {
        console.error('tab1', this.props);
        return (
            <Row gutter={25} type="flex" justify="space-between" style={{ marginLeft: '0px', marginRight: '0px', width: '98.5%' }}>
                {this.state.templates.map(item => (<CardLog key={item.name} {...item} />))}
            </Row>
        );
    }
}

Tab1.propTypes = {
    tab1Submit: PropTypes.func,
    form: PropTypes.object,
};
export default Form.create()(Tab1);
