import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Log from '../../../../schema/log';
import Day from './component/Day';
import ButtonTab from './component/ButtonTab';

const urls = ['/manage/logging', '/manage/logging/week', '/manage/logging/day', '/manage/logging/month', '/manage/logging/sale'];

class Tab1 extends (React.PureComponent || React.Component) {
    constructor(props) {
        super(props);
        this.state = {
            logType: '日报',
            expand: false,
            disabledType: false,
            templates: [
                { name: '日报', url: '/manage/logging' },
                { name: '周报', url: '/manage/logging/week' },
                { name: '月报', url: '/manage/logging/month' },
                { name: '营业日报', url: '/manage/logging/sale' },
            ],
            template: [],
        };
    }
    componentWillMount() {
        this.setState({ template: this.state.templates.slice(0, 2) });
    }
    // more
    moreChange = () => {
        const { expand } = this.state;
        const template = expand ? this.state.templates.slice(0, 2) : this.state.templates.slice(0);
        this.setState({ expand: !expand, template });
    }
    choooseCachelog = (type) => {
        const { cachelog } = this.props;
        let cache = {};
        for (let i = 0; i < cachelog.length; i++) {
            if (type === cachelog[i].type) {
                cache = cachelog[i];
                break;
            }
        }
        return cache;
    }
    routers = location => (
        <div className="">
            {urls.indexOf(location.pathname) >= 0 ? <ButtonTab choooseCachelog={this.choooseCachelog} moreChange={this.moreChange} {...this.state} {...this.props} /> : null}
            <Route exact path="/manage/logging" component={Day} />
            <Route path="/manage/logging/week" component={Day} />
            <Route path="/manage/logging/month" component={Day} />
        </div>
    )
    render() {
        const { location } = this.props;
        // console.log('wirite', this.props);
        return (
            <div>
                {this.routers(location)}
            </div>
        );
    }
}
Tab1.propTypes = {
    form: PropTypes.object,
    location: PropTypes.object,
};

export default withTracker(() => {
    Meteor.subscribe('log');
    const mainCompany = Meteor.user() && Meteor.user().profile.mainCompany;
    const userId = Meteor.user() && Meteor.user()._id;
    return {
        cachelog: Log.find({ userId, company: mainCompany, cache: true }).fetch(),
    };
})(Tab1);
