import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from '../views/header/Header';

const CreateIndexPage = WrappedComponent =>
    class IndexPageWrap extends Component {
        static propTypes = {
            history: PropTypes.object.isRequired,
            location: PropTypes.object.isRequired,
            match: PropTypes.object.isRequired,
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
                    <WrappedComponent {...this.props} />
                </div>
            );
        }
    };

export default CreateIndexPage;
