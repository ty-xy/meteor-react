import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';

import App from './views/App.jsx';
import styles from './styles/util.less';

Meteor.startup(() => {
    render(
        <App />,
        document.getElementById('app')
    )
});
