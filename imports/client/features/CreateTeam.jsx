import React, { Component } from 'react';
import { Form, Input, Button, Select, Cascader } from 'antd';
import PropTypes from 'prop-types';

import Avatar from '../components/Avatar';
import AvatarSelf from '../components/AvatarSelf';
import Icon from '../components/Icon';
// import AddGroup from '../views/chat/chatSideLeft/addChat/AddGroup';

const FormItem = Form.Item;
const Option = Select.Option;

const residences = [{
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{
            value: 'xihu',
            label: 'West Lake',
        }],
    }],
}, {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
        }],
    }],
}];
class CreateTeam extends Component {
    static propTypes = {
        form: PropTypes.object,
    }
    constructor() {
        super();
        this.state = {
            formLayout: 'horizontal',
            isShowAddGroup: false,
            industryType: [
                {

                },
            ],
        };
    }
    handleAddMembers = () => {
        this.setState({
            isShowAddGroup: !this.state.isShowAddGroup,
        });
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
        return (
            <div>
                <Form layout={formLayout} onSubmit={this.handleSubmit}>
                    <FormItem>
                        <div className="upload-team-avatar">
                            <Avatar avatar="http://oxldjnom8.bkt.clouddn.com/groupAvatar.png" name="团队" />
                            <p className="edit-avatar">修改头像
                                <input type="file" id="avatar" onChange={this.handleUploadImg} />
                            </p>
                        </div>
                    </FormItem>
                    <FormItem
                        label="团队名称"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('name', {
                            rules: [{
                                type: 'string', message: '类型为string!',
                            }, {
                                required: true, message: '商品名称!',
                            }],
                        })(
                            <Input placeholder="团队名称" />,
                        )}
                    </FormItem>
                    <FormItem
                        label="行业类型"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('img', {
                            rules: [{
                                type: 'string', message: '类型为string!',
                            }],
                        })(
                            <Select placeholder="行业类型">
                                <Option value="china">建筑设计</Option>
                                <Option value="use">土木工程</Option>
                                <Option value="use">装饰装潢</Option>
                                <Option value="use">房地产</Option>
                                <Option value="use">物业管理</Option>
                                <Option value="use">建材</Option>
                                <Option value="use">其他</Option>
                            </Select>,
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="所在地区"
                    >
                        {getFieldDecorator('residence', {
                            initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                            rules: [{ type: 'array' }],
                        })(
                            <Cascader options={residences} />,
                        )}
                    </FormItem>
                    <FormItem
                        label="添加成员"
                        {...formItemLayout}
                    >
                        <br />
                        <div className="members-avatar">
                            <div className="avatar-wrap">
                                <AvatarSelf />
                                <Avatar name="哈哈" avatarColor="red" avatar="" />
                            </div>
                            <div className="add-members" onClick={this.handleAddMembers}>
                                <Icon icon="icon-tianjia3 icon" size={35} />
                            </div>
                        </div>
                    </FormItem>
                    <FormItem {...buttonItemLayout}>
                        <Button type="primary" htmlType="submit">创建</Button>
                    </FormItem>
                </Form>
                {/* <AddGroup
                    handleAddGroup={this.handleAddMembers}
                    isShowAddGroup={this.state.isShowAddGroup}
                    type="createGroup"
                /> */}
            </div>
        );
    }
}

export default Form.create({})(CreateTeam);
