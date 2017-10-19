import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from '../views/header/Header';

class IndexPageWrap extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        children: PropTypes.element,
    }
    static childContextTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    }
    getChildContext() {
        const { history, location, match } = this.props;
        return {
            history,
            location,
            match,
        };
    }
    render() {
        return (
            <div className="index-page-wrap">
                <Header goto={this.goto} />
                {this.props.children}
            </div>
        );
    }
}

function createIndexPage(PageComponent) {
    return function render(router) {
        return (
            <IndexPageWrap {...router}>
                <PageComponent />
            </IndexPageWrap>
        );
    };
}

export default createIndexPage;
