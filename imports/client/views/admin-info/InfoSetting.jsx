import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Cascader, Select, Form, Input, Button } from 'antd';

import AvatarSelf from '../../components/AvatarSelf';
import feedback from '../../../util/feedback';
import pcaData from '../../../util/pcaData';

const Option = Select.Option;
const FormItem = Form.Item;

class InfoSetting extends Component {
    static propTypes = {
        user: PropTypes.object,
        form: PropTypes.object,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            residences: pcaData.pca,
            formLayout: 'horizontal',
        };
    }
    handleUploadImg = (e) => {
        const image = e.target.files[0];
        if (!image) {
            return;
        }
        const reader = new FileReader();
        const { _id = '' } = this.props.user;

        reader.onloadend = function () {
            Meteor.call('changeAvatar', this.result, _id, (err) => {
                if (err) {
                    return console.error(err.reason);
                }
                console.log('修改头像成功');
            });
        };
        reader.readAsDataURL(image);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, formValues) => {
            if (!err) {
                Meteor.call('changeUserBaseInfo', formValues, (error) => {
                    if (error) {
                        return feedback.dealError('修改成功');
                    }
                    return feedback.dealSuccess('修改成功');
                });
            }
        });
    }
    convertAddress = (address) => {
        if (!address.length) {
            return;
        }
        const currentProvince = this.state.residences.find(n => n.value === address[0]);
        const province = currentProvince.label || '';
        const currentCity = currentProvince.children.find(n => n.value === address[1]);
        const city = currentCity.label || '';
        const currentArea = currentCity.children.find(n => n.value === address[2]);
        const area = currentArea.label || '';
        return [province, city, area];
        //  return `${province}/${city}/${area}`;
    }
    render() {
        const { formLayout } = this.state;
        const formItemLayout = formLayout === 'horizontal' ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        } : null;
        const buttonItemLayout = formLayout === 'horizontal' ? {
            wrapperCol: { span: 14, offset: 4 },
        } : null;
        const { getFieldDecorator } = this.props.form;
        const { profile = {}, username = '' } = this.props.user;
        const { name = '', signature = '', age = '', sex = 'male', address = [] } = profile;
        const userAddress = this.convertAddress(address);
        // console.log(userAddress);

        return (
            <ul className="info-setting">
                <Form layout={formLayout} onSubmit={this.handleSubmit}>
                    <FormItem
                        label="头像"
                        {...formItemLayout}
                    >
                        <div className="change-self-avatar">
                            <AvatarSelf />
                            <p className="edit-avatar">修改头像
                                <input type="file" id="avatar" onChange={this.handleUploadImg} ref={i => this.fileInput = i} />
                            </p>
                        </div>
                    </FormItem>
                    <FormItem
                        label="姓名"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('name', {
                            rules: [{
                                type: 'string', message: '类型为string!',
                            }, {
                                required: true, message: '姓名必填!',
                            }],
                            initialValue: name,
                        })(

                            <Input placeholder="团队名称" />,
                        )}
                    </FormItem>
                    <FormItem
                        label="手机号"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('username', {
                            rules: [{
                                type: 'string', message: '类型为string!',
                            }, {
                                required: true, message: '手机号必填!',
                            }],
                            initialValue: username,
                        })(

                            <Input placeholder="手机号" disabled />,
                        )}
                    </FormItem>
                    <FormItem
                        label="签名"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('signature', {
                            rules: [{
                                type: 'string', message: '类型为string!',
                            }, {
                            }],
                            initialValue: signature,
                        })(

                            <Input placeholder="签名" />,
                        )}
                    </FormItem>
                    <FormItem
                        label="性别"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('sex', {
                            rules: [{
                                type: 'string', message: '类型为string!',
                            }, {
                            }],
                            initialValue: sex,
                        })(
                            <Select placeholder="性别" >
                                <Option value="male" >男</Option>
                                <Option value="female">女</Option>
                            </Select>,
                        )}
                    </FormItem>
                    <FormItem
                        label="年龄"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('age', {
                            rules: [{
                                type: 'string', message: '类型为string!',
                            }, {
                            }],
                            initialValue: age,
                        })(

                            <Input placeholder="年龄" />,
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="所在地区"
                    >
                        {getFieldDecorator('address', {
                            initialValue: userAddress,
                        })(
                            <Cascader
                                options={this.state.residences}
                                placeholder="请选择地区"
                            />,
                        )}
                    </FormItem>
                    <FormItem {...buttonItemLayout}>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </FormItem>
                </Form>
            </ul>
        );
    }
}

export default Form.create({})(
    withTracker(() => ({
        user: Meteor.user() || {},
    }))(InfoSetting),
);
