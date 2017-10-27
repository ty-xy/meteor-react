import React, { Component } from 'react';
// import { Router, Route, Link, Switch } from 'react-router';
import {
    Link,
} from 'react-router-dom';
import PropTypes from 'prop-types';

class App extends Component {
    static propTypes = {
        children: PropTypes.object,
    }
    constructor(props) {
        super(props);
        this.state = {};
    }
    jump = (e) => {
        e.preventDefault();
        this.context.history.push('/manage/notice/about');
    }
    render() {
        console.log(this.props);
        return (
            <div>
                <h1>App</h1>
                <ul>
                    <li><Link to="/manage/notice">Home</Link></li>
                    <li><a href="" onClick={this.jump}>About</a></li>
                    <li><Link to="/manage/notice/inbox">Inbox</Link></li>
                </ul>
                {this.props.children}

            </div>
        );
    }
}
App.contextTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
};


export default App;
