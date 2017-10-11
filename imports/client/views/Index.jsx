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
            if (!Meteor.user()) {
                this.props.history.push('/login');
            } else {
                this.props.history.push('/chat');
            }
        });
    }
    render() {
        return <div />;
    }
}

export default Index;
