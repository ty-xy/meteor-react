import React, { Component } from 'react';

class InfoSetting extends Component {
    render() {
        return (
            <ul className="info-setting">
                <li>
                    <label htmlFor="avatar">头像</label>
                    <input type="file" id="avatar" />
                </li>
                <li>
                    <label htmlFor="nickname">姓名</label>
                    <input type="text" id="nickname" placeholder="请您输入姓名" />
                </li>
                <li>
                    <label htmlFor="phone">手机号</label>
                    <input type="number" id="phone" />
                </li>
                <li>
                    <label htmlFor="signature">签名</label>
                    <input type="text" id="signature" />
                </li>
                <li>
                    <label htmlFor="sex">性别</label>
                    <select name="sex" id="sex">
                        <option value="man">男</option>
                        <option value="women">女</option>
                    </select>
                </li>
                <li>
                    <label htmlFor="age">年龄</label>
                    <input type="number" id="age" />
                </li>
                <li>
                    <label htmlFor="avatar">所在地</label>
                    <select name="sex" id="sex">
                        <option value="man">男</option>
                        <option value="women">女</option>
                    </select>
                </li>
                <li>
                    <label htmlFor="company">企业</label>
                    <input type="text" id="company" />
                </li>
                <li>
                    <label htmlFor="career">职业</label>
                    <input type="职业" id="career" />
                </li>
                <li>
                    <button>保存</button>
                </li>
            </ul>
        );
    }
}

export default InfoSetting;
