import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import Day from './component/Day';
import ButtonTab from './component/ButtonTab';

const urls = ['/manage/logging', '/manage/logging/week', '/manage/logging/day', '/manage/logging/month', '/manage/logging/sale'];


class Tab1 extends (React.PureComponent || React.Component) {
    constructor(props) {
        super(props);
        this.state = {
            logType: '日报',
            expand: false,
            disabledType: false,
            templates: [
                { name: '日报', url: '/manage/logging' },
                { name: '周报', url: '/manage/logging/week' },
                { name: '月报', url: '/manage/logging/month' },
                { name: '营业日报', url: '/manage/logging/sale' },
            ],
            template: [],
            editData: {},
        };
    }
    componentWillMount() {
        this.setState({ template: this.state.templates.slice(0, 2) });
    }
    // 日报， 周报切换
    handleLogChange = (e) => {
        const _this = this;
        console.log('handleLogChange', this.props, this.state);
        // Modal.confirm({
        //     title: '温馨提示',
        //     content: '您尚未保存，确定要离开？',
        //     okText: '确认',
        //     cancelText: '取消',
        //     onOk: () => { _this.setState({ logType: e.target.value, editData: {} }); },
        // });
        _this.setState({ logType: e.target.value, editData: {} });
    }
    // more
    moreChange = () => {
        const { expand } = this.state;
        const template = expand ? this.state.templates.slice(0, 2) : this.state.templates.slice(0);
        this.setState({ expand: !expand, template });
    }
    routers = location => (
        <div className="">
            {urls.indexOf(location.pathname) >= 0 ? <ButtonTab handleLogChange={this.handleLogChange} moreChange={this.moreChange} {...this.state} {...this.props} /> : null}
            <Route exact path="/manage/logging" component={Day} />
            <Route path="/manage/logging/week" component={Day} />
            <Route path="/manage/logging/month" component={Day} />
        </div>
    )
    render() {
        console.log('write', this.props);
        const { location } = this.props;
        return (
            <div>
                {this.routers(location)}
            </div>
        );
    }
}

Tab1.propTypes = {
    form: PropTypes.object,
    location: PropTypes.object,
};
export default Tab1;
