import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PageWrap extends Component {
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
                {this.props.children}
            </div>
        );
    }
}

function RouterPage(PageComponent) {
    return function render(router) {
        return (
            <PageWrap {...router}>
                <PageComponent />
            </PageWrap>
        );
    };
}

export default RouterPage;
