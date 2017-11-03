import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

class componentName extends Component {
    static propTypes = {
        type: PropTypes.string,
    }
    renderIcon = (type) => {
        switch (type) {
        case 'jpg':
            return <Icon icon="icon-wenjiangeshi-jpg icon" iconColor="#039BE5" />;
        case 'jpeg':
            return <Icon icon="icon-wenjiangeshi-jpg icon" iconColor="#039BE5" />;
        case 'pdf':
            return <Icon icon="icon-wenjiangeshi-pdf icon" iconColor="#EF5350" />;
        case 'png':
            return <Icon icon="icon-wenjiangeshi-png icon" iconColor="#29B6F6" />;
        case 'xls':
            return <Icon icon="icon-xlx icon" iconColor="#66BB6A " />;
        case 'ppt':
            return <Icon icon="icon-wenjiangeshi-ppt1 icon" iconColor="#EF5350" />;
        case 'zip':
            return <Icon icon="icon-wenjiangeshi-zip1 icon" iconColor="#78909C " />;
        case 'gif':
            return <Icon icon="icon-gif icon" iconColor="#29B6F6" />;
        case 'rar':
            return <Icon icon="icon-wenjiangeshi-rar icon" iconColor="#78909C" />;
        case 'mp3':
            return <Icon icon="icon-wenjiangeshi-mp icon" iconColor="#EC407A" />;
        case 'word':
            return <Icon icon="icon-word1 icon" iconColor="#5C6BC0" />;
        case 'exe':
            return <Icon icon="icon-exe icon" iconColor="#5C6BC0" />;
        case 'txt':
            return <Icon icon="icon-wenjiangeshi-txt icon" iconColor="#8D6E63" />;
        default:
            return <Icon icon="icon-weizhiwenjian icon" iconColor="#C1C5D2" />;
        }
    }
    render() {
        return (
            <div>
                {this.renderIcon(this.props.type.toLowerCase())}
            </div>
        );
    }
}

export default componentName;
