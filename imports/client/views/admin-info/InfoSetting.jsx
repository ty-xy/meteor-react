import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Cascader, Select, Form, Input, Button } from 'antd';

import AvatarSelf from '../../components/AvatarSelf';
import feedback from '../../../util/feedback';
import pcaData from '../../../util/pcaData';
import PopulateUtil from '../../../util/populate';

import AvatarCut from '../../features/AvatarCut';

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
        if (image.size > 800000) {
            feedback.dealError('请选择小于800kb的头像');
            return;
        }

        const _this = this;
        const reader = new FileReader();
        reader.onloadend = function () {
            _this.showAvatarCut(true, this.result);
        };
        reader.readAsDataURL(image);
    }
    // 显示修改头像
    showAvatarCut = (bool, avatarDate = '') => {
        this.setState({ avatarCutVisible: bool, avatarDate });
    }
    // 提交图片保存
    handleAvatar=(img) => {
        const { _id = '' } = this.props.user;
        Meteor.call('changeAvatar', img, _id, (err) => {
            if (err) {
                return console.error(err.reason);
            }
            this.showAvatarCut(false);
            feedback.dealSuccess('修改成功');
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, formValues) => {
            if (!err) {
                Meteor.call('changeUserBaseInfo', formValues, (error) => {
                    if (error) {
                        return feedback.dealError('修改失败');
                    }
                    return feedback.dealSuccess('修改成功');
                });
            }
        });
    }
    renderCompany = (companyIds) => {
        const companyList = companyIds.map(companyId => PopulateUtil.company(companyId));
        return companyList.map(company => company && <p key={company._id}>{company.name}</p>);
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
        const { name = '', signature = '', age = '', sex = 'male', address = [], company = [] } = profile;
        return (
            <ul className="info-setting">
                <Form layout={formLayout} onSubmit={this.handleSubmit}>
                    <FormItem
                        label="头像"
                        {...formItemLayout}
                        style={{ marginBottom: '15px' }}
                    >
                        <AvatarCut
                            visible={this.state.avatarCutVisible}
                            showAvatarCut={this.showAvatarCut}
                            handleAvatar={this.handleAvatar}
                            avatarDate={this.state.avatarDate}
                        />
                        <div className="group-avatar-wrap">
                            {/* 头像裁剪 */}
                            <AvatarSelf />
                            <div className="choose-new-avatar">
                                修改
                                <input type="file" id="avatar" accept="image/png,image/jpg,image/jpeg,image/svg" onChange={this.handleUploadImg} ref={i => this.fileInput = i} />
                            </div>
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
                            initialValue: address,
                        })(
                            <Cascader
                                options={this.state.residences}
                                placeholder="请选择地区"
                            />,
                        )}
                    </FormItem>
                    {
                        company.length ?
                            <FormItem
                                {...formItemLayout}
                                label="所在公司"
                            >
                                {
                                    this.renderCompany(company)
                                }
                            </FormItem>
                            :
                            null
                    }

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
