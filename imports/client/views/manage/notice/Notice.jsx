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
    render() {
        return (
            <div>
                <h1>App</h1>
                <ul>
                    <li><Link to="/manage/notice">Home</Link></li>
                    <li><Link to="/manage/notice/about">About</Link></li>
                    <li><Link to="/manage/notice/inbox">Inbox</Link></li>
                </ul>
                {this.props.children}

            </div>
        );
    }
}


export default App;
