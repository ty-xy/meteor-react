import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

@pureRender
class Index extends Component {
    static propTypes = {
        history: PropTypes.object,
        location: PropTypes.object,
        hash: PropTypes.string,
    }
    componentWillMount() {
        Meteor.autorun(() => {
            const user = Meteor.user();
            const { history, location } = this.props;
            if (!user && this.isLogin === true && this.props.hash === '') {
                this.isLogin = false;
                if (location.search && location.search.indexOf('companyId')) {
                    history.push({ pathname: '/login', search: location.search, state: 'invite' });
                } else {
                    history.push('/login');
                }
            } else if (user && this.isLogin === false) {
                this.isLogin = true;
                if (location.search && location.state === 'invite') {
                    history.push({ pathname: '/chat', search: location.search, state: location.state });
                } else {
                    history.push('/chat');
                }
            }
            //  else if (!user && this.isLogin === true && this.props.hash === '#id') {
            //     // this.isLogin = false;
            //     if (location.search && location.search.indexOf('companyId')) {
            //         history.push({ pathname: '/register', search: location.search, state: 'invite' });
            //     } else {
            //         history.push('/register');
            //     }
            // }
        });
    }
    isLogin = true;
    render() {
        return <div />;
    }
}

export default Index;
