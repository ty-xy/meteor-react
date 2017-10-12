import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { Select } from 'antd';

const Option = Select.Option;
@pureRender
class AddGroup extends Component {
    static propTypes = {
        isShowAddGroup: PropTypes.bool,
        handleAddGroup: PropTypes.func,
    };
    handleChange = (value) => {
        console.log(`selected ${value}`);
    }
    render() {
        return (
            <div className="container-wrap add-group-block" style={{ display: this.props.isShowAddGroup ? 'block' : 'none' }}>
                <div className="container-middle container-content">
                    <div className="container-title">
                        发起群聊
                        <i className="icon icon-close-addGroup icon-close" onClick={this.props.handleAddGroup}>&#xe641;</i>
                    </div>
                    <Select defaultValue="lucy" onChange={this.handleChange} className="select-group-item">
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                    <ul className="select-group-list">
                        <li className="group-user-item">
                            <p className="checkbox">
                                <i className="icon">&#xe60d;</i>
                            </p>
                            <p className="user-info">
                                <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506511526484&di=1b6057880338f100af8c233684f0c1a0&imgtype=0&src=http%3A%2F%2Fimg.mp.itc.cn%2Fupload%2F20160920%2Fc524ae81c00c40899838f22519f3c46f_th.jpg" alt="" />
                                李荣浩
                            </p>
                        </li>
                        <li className="group-user-item">
                            <p className="checkbox">
                                {/* <i className="icon">&#xe60d;</i> */}
                                <i className="icon">&#xe675;</i>
                            </p>
                            <p className="user-info">
                                <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506511364502&di=898073fad78c6ab59a9e5d5f44931047&imgtype=0&src=http%3A%2F%2Fi7.download.fd.pchome.net%2Ft_960x600%2Fg1%2FM00%2F0C%2F1A%2FooYBAFR4MlGIGMtrAAF0dYwq03MAACHlQP3vm4AAXSN055.jpg" alt="" />
                                黄晓明
                            </p>
                        </li>
                        <li className="group-user-item">
                            <p className="checkbox">
                                {/* <i className="icon">&#xe60d;</i>  */}
                                <i className="icon">&#xe675;</i>
                            </p>
                            <p className="user-info">
                                <img src="http://i1.qhimg.com/t019b6071c1f0fc1532.jpg" alt="" />
                                罗志祥
                            </p>
                        </li>
                        <li className="group-user-item">
                            <p className="checkbox">
                                <i className="icon">&#xe60d;</i>
                            </p>
                            <p className="user-info user-info-last">
                                <img src="http://b.hiphotos.baidu.com/baike/pic/item/91ef76c6a7efce1b4c2344b8ac51f3deb48f65bc.jpg" alt="" />
                                孙红雷
                            </p>
                        </li>
                    </ul>
                    <div className="selected-avatar">
                        <img src="http://i1.qhimg.com/t019b6071c1f0fc1532.jpg" alt="" />
                        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506511364502&di=898073fad78c6ab59a9e5d5f44931047&imgtype=0&src=http%3A%2F%2Fi7.download.fd.pchome.net%2Ft_960x600%2Fg1%2FM00%2F0C%2F1A%2FooYBAFR4MlGIGMtrAAF0dYwq03MAACHlQP3vm4AAXSN055.jpg" />
                    </div>
                    <div>
                        <div className="confirm-btn">
                            确定(2)
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default AddGroup;
