import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row } from 'antd';
import classnames from 'classnames';
import Write from './component/Write';
import Read from './component/Read';
import Detail from './component/Detail';


class App extends Component {
    static propTypes = {
        location: PropTypes.object,
    }
    constructor(props) {
        super(props);
        this.state = {};
    }
    // Tab不切换
    tabs = ({ pathname }) => (
        (pathname === '/manage/notice' || pathname === '/manage/notice/list') ? <Row className="e-mg-notice-tab">
            <Link to="/manage/notice" className={classnames({ 'e-mg-notice-tab-a-active': pathname === '/manage/notice' })}>发布公告</Link>
            <Link to="/manage/notice/list" className={classnames({ 'e-mg-notice-tab-a-active': pathname === '/manage/notice/list' })}>已发布公告</Link>
        </Row> : null
    )
    // 路由
    Routes = () => (
        <div style={{ height: '100%' }}>
            <Route exact path="/manage/notice" component={Write} />
            <Route path="/manage/notice/list" component={Read} />
            <Route path="/manage/notice/detail/:id" component={Detail} />
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


export default App;
