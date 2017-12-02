import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

@pureRender
class Index extends Component {
    static propTypes = {
        history: PropTypes.object,
    }
    componentWillMount() {
        Meteor.autorun(() => {
            const user = Meteor.user();
            const { history } = this.props;
            if (!user && this.isLogin === true) {
                this.isLogin = false;
                this.props.history.push('/login');
            } else if (user && this.isLogin === false) {
                this.isLogin = true;
                if (history.location.search && history.location.state === 'invite') {
                    console.log('history', history);
                    this.props.history.push({ pathname: '/chat', search: history.location.search, state: history.location.state });
                } else {
                    this.props.history.push('/manage/logging');
                }
            }
        });
    }
    isLogin = true;
    render() {
        return <div />;
    }
}

export default Index;
