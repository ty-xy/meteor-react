import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from '../views/header/Header';
import BackEnd from '../views/backEnd/BackEnd';

class IndexPageWrap extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        children: PropTypes.element,
        headType: PropTypes.string,
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
                {
                    this.props.headType === 'backend' ?
                        <BackEnd />
                        :
                        <Header />
                }
                {this.props.children}
            </div>
        );
    }
}

function createIndexPage(PageComponent, headType) {
    return function render(router) {
        return (
            <IndexPageWrap {...router} headType={headType}>
                <PageComponent {...router} />
            </IndexPageWrap>
        );
    };
}

export default createIndexPage;
