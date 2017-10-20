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
            if (!user && this.isLogin === true) {
                this.isLogin = false;
                this.props.history.push('/login');
            } else if (user && this.isLogin === false) {
                this.isLogin = true;
                this.props.history.push('/chat');
            }
        });
    }
    isLogin = true;
    render() {
        return <div />;
    }
}

export default Index;
