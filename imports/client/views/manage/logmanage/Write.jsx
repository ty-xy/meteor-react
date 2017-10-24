import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import Day from './component/Day';
import Week from './component/Week';
import ButtonTab from '../component/ButtonTab';


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
        // console.log('object', this.props.location);
        this.setState({ template: this.state.templates.slice(0, 2) });
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
    showLogtype = () => ({
        day: <Day {...this.props} {...this.state} />,
        week: <Week {...this.props} {...this.state} />,
        month: <Week {...this.props} {...this.state} />,
        business: <Week {...this.props} {...this.state} />,
    })
    // more
    moreChange = () => {
        const { expand } = this.state;
        const template = expand ? this.state.templates.slice(0, 2) : this.state.templates.slice(0);
        this.setState({ expand: !expand, template });
    }
    render() {
        // console.error('tab1', this.props);
        const { logType } = this.state;
        return (
            <div>
                <ButtonTab handleLogChange={this.handleLogChange} moreChange={this.moreChange} {...this.state} {...this.props} />
                {this.showLogtype()[logType]}
            </div>
        );
    }
}

Tab1.propTypes = {
    form: PropTypes.object,
};
export default Tab1;
