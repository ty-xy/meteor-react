import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from '../views/header/header';

class IndexPageWrap extends Component {
    static propTypes = {
        history: PropTypes.object,
        children: PropTypes.element,
    }
    goto = (path) => {
        this.props.history.push(path);
    }
    render() {
        return (
            <div className="view-header-index">
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
