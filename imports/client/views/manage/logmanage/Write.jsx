import React from 'react';
import PropTypes from 'prop-types';
import Day from './component/Day';
import Week from './component/Week';
import ButtonTab from '../component/ButtonTab';


class Tab1 extends (React.PureComponent || React.Component) {
    constructor(props) {
        super(props);
        this.state = {
            logType: '日报',
            expand: false,
            disabledType: false,
            templates: ['日报', '周报', '月报', '营业日报'],
            template: [],
            editData: {},
        };
    }
    componentWillMount() {
        // console.log('componentWillMount', this.props);
        const { editInfo } = this.props;
        if (editInfo._id) {
            this.setState({ template: this.state.templates.slice(0, 2), editData: editInfo, logType: editInfo.type, disabledType: true });
        } else {
            this.setState({ template: this.state.templates.slice(0, 2) });
        }
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
    showLogtype = () => ({
        日报: <Day {...this.props} {...this.state} />,
        周报: <Week {...this.props} {...this.state} />,
        月报: <Week {...this.props} {...this.state} />,
        营业日报: <Week {...this.props} {...this.state} />,
    })
    // more
    moreChange = () => {
        const { expand } = this.state;
        const template = expand ? this.state.templates.slice(0, 2) : this.state.templates.slice(0);
        this.setState({ expand: !expand, template });
    }
    render() {
        const { logType } = this.state;
        console.log('PureComponent', this.props, this.state);
        return (
            <div style={{ height: '100%' }}>
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
