import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import PropTypes from 'prop-types';

@pureRender
class BaikeLeftSide extends Component {
    static propTypes = {
        history: PropTypes.object,
    }
    constructor(...props) {
        super(...props);
        this.state = {
            color: true,
            color1: false,
            color2: false,
            color3: false,
            color4: false,
        };
    }
    componentWillUpdate=() => {
        const pathname = this.props.history.location.pathname;
        switch (pathname) {
        case '/baike': this.setState({
            color: true,
            color1: false,
            color2: false,
            color3: false,
            color4: false,
        }); break;
        case '/baike/people': this.setState({
            color1: true,
            color: false,
            color2: false,
            color3: false,
            color4: false,
        }); break;
        case '/baike/company': this.setState({
            color2: true,
            color: false,
            color1: false,
            color3: false,
            color4: false,
        }); break;
        case '/baike/file': this.setState({
            color3: true,
            color: false,
            color1: false,
            color2: false,
            color4: false,
        }); break;
        case '/baike/answer': this.setState({ color4: true,
            color: false,
            color1: false,
            color2: false,
            color3: false,
        }); break;
        default:
            break;
        }
    }
    render() {
        // console.log(this.props);
        return (
            <ul className="ejian-lian-baike">
                <Link to="/baike">
                    <li
                        className={classnames('ejianlian-left-nav', { 'baike-pannel-avtive': this.state.color })}
                    >
                        首页
                    </li>
                </Link>
                <Link to="/baike/people">
                    <li
                        className={classnames('ejianlian-left-nav', { 'baike-pannel-avtive': this.state.color1 })}
                    >
                        人物
                    </li>
                </Link>
                <Link to="/baike/company">
                    <li
                        className={classnames('ejianlian-left-nav', { 'baike-pannel-avtive': this.state.color2 })}
                    >
                    企业</li>
                </Link>
                <Link to="/baike/file">
                    <li
                        className={classnames('ejianlian-left-nav', { 'baike-pannel-avtive': this.state.color3 })}
                    >
                    文库</li>
                </Link>
                <Link to="/baike/answer">
                    <li
                        className={classnames('ejianlian-left-nav', { 'baike-pannel-avtive': this.state.color4 })}
                    >
                    问答</li>
                </Link>
            </ul>
        );
    }
}

export default BaikeLeftSide;
