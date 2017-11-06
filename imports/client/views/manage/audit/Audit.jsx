import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Category from './AuditCategory';
import Leave from './Leave';
import Business from './Business';
import ChackBill from './CheckBill';
import CommonAudit from './CommonAudit';
import Approvaling from './Approvaling';

const urls = ['/manage/audit/approvaling', '/manage/audit/done', '/manage/audit/self', '/manage/audit/copy', '/manage/audit'];

class Audit extends Component {
    static propTypes = {
        location: PropTypes.object,
    }
    constructor(props) {
        super(props);
        this.state = {};
    }
    // Tab不切换
    tabs = ({ pathname }) => (urls.indexOf(pathname) >= 0 &&
        (<div className="e-mg-audit-tab-pre">
            <Link to="/manage/audit/preinstall" className={pathname === '/manage/audit/list' ? 'e-mg-audit-tab-active' : ''}>审批预设</Link>
        </div>)
    )
    // 路由
    audit = () => {
        const { pathname } = this.props.location;
        const isShow = urls.indexOf(pathname);
        return (
            <div className="e-mg-audit-content">
                {
                    isShow >= 0 ? (
                        <div className="e-mg-audit-tab">
                            <Link to="/manage/audit" className={pathname === '/manage/audit' ? 'e-mg-audit-tab-active' : ''}>发起审批</Link>
                            <Link to="/manage/audit/approvaling" className={pathname === '/manage/audit/approvaling' ? 'e-mg-audit-tab-active' : ''}>待审批的</Link>
                            <Link to="/manage/audit/done" className={pathname === '/manage/audit/done' ? 'e-mg-audit-tab-active' : ''}>已经审批的</Link>
                            <Link to="/manage/audit/self" className={pathname === '/manage/audit/self' ? 'e-mg-audit-tab-active' : ''}>我发起的</Link>
                            <Link to="/manage/audit/copy" className={pathname === '/manage/audit/copy' ? 'e-mg-audit-tab-active' : ''}>抄送我的</Link>
                        </div>
                    ) : null
                }
                <div className="e-mg-audit-content-body">
                    <Route exact strict path="/manage/audit" component={Category} />
                    <Route strict path="/manage/audit/approvaling" component={Approvaling} />
                    <Route strict path="/manage/audit/done" component={() => (<div>已经审批的</div>)} />
                    <Route strict path="/manage/audit/self" component={() => (<div>我发起的</div>)} />
                    <Route strict path="/manage/audit/copy" component={() => (<div>抄送我的</div>)} />
                    <Route strict path="/manage/audit/leave" component={Leave} />
                    <Route strict path="/manage/audit/business" component={Business} />
                    <Route strict path="/manage/audit/bill" component={ChackBill} />
                    <Route strict path="/manage/audit/common" component={CommonAudit} />
                </div>
            </div>
        );
    }
    Routes = () => (
        <div style={{ height: '100%' }}>
            <Route
                path="/manage/audit"
                component={({ match }) => this.audit(match)}
            />
            <Route path="/manage/audit/preinstall" component={() => (<div>preinstall</div>)} />
        </div>
    )
    render() {
        const { location } = this.props;
        // console.log('dudit', this.props);
        return (
            <div className="e-mg-audit">
                {this.tabs(location)}
                {this.Routes()}
            </div>
        );
    }
}


export default Audit;
