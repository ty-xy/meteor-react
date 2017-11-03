import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';

import App from '../imports/client/App';


Meteor.startup(() => {
    // const socket = require('socket.io-client')('http://localhost:3002');


    // socket.on('connect', () => {
    //     console.log('Client connected');
    //     socket.emit('message', 222);
    // });
    // socket.on('disconnect', () => {
    //     console.log('Client disconnected');
    // });
    // socket.on('news', (data) => {
    //     console.log(data);
    // });
    render(
        <App />,
        document.getElementById('app'),
    );
});
