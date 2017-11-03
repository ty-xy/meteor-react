import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row } from 'antd';
import Write from './component/Write';
import Read from './component/Read';


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
        <Row className="e-mg-notice-tab">
            <Link to="/manage/notice" className={pathname === '/manage/notice' ? 'e-mg-notice-tab-a-active' : ''}>发布公告</Link>
            <Link to="/manage/notice/list" className={pathname === '/manage/notice/list' ? 'e-mg-notice-tab-a-active' : ''}>已发布公告</Link>
        </Row>
    )
    // 路由
    Routes = () => (
        <div style={{ height: '100%' }}>
            <Route exact path="/manage/notice" component={Write} />
            <Route path="/manage/notice/list" component={Read} />
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
