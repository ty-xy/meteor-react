import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row } from 'antd';
import Write from './Write';
import Inbox from './Look';
import Outbox from './MyLog';
import Detail from './Detail';

const writes = ['/manage/logging', '/manage/logging/week', '/manage/logging/day', '/manage/logging/month', '/manage/logging/sale'];
const urls = ['/manage/logging', '/manage/logging/outbox', '/manage/logging/inbox', '/manage/logging/week', '/manage/logging/day', '/manage/logging/month', '/manage/logging/sale'];

class Log extends Component {
    static propTypes = {
        location: PropTypes.object,
    }
    constructor(props) {
        super(props);
        this.state = {};
    }
    // Tab不切换
    tabs = ({ pathname }) => (urls.indexOf(pathname) > -1 ?
        (<Row className="e-mg-notice-tab">
            <Link to="/manage/logging" className={(writes.indexOf(pathname) >= 0) ? 'e-mg-notice-tab-a-active' : ''}>写日报</Link>
            <Link to="/manage/logging/outbox" className={pathname === '/manage/logging/outbox' ? 'e-mg-notice-tab-a-active' : ''}>我发出的</Link>
            <Link to="/manage/logging/inbox" className={pathname === '/manage/logging/inbox' ? 'e-mg-notice-tab-a-active' : ''}>我收到的</Link>
        </Row>) : null
    )
    // 路由
    Routes = () => (
        <div style={{ height: '100%', overflow: 'auto' }}>
            <Route extra path="/manage/logging" component={Write} />
            <Route strict path="/manage/logging/outbox" component={Outbox} />
            <Route strict path="/manage/logging/inbox" component={Inbox} />
            <Route strict path="/manage/logging/detail/:id" component={Detail} />
        </div>
    )
    render() {
        const { location } = this.props;
        return (
            <div className="e-mg-notice">
                {this.tabs(location)}
                {this.Routes()}
            </div>
        );
    }
}


export default Log;
