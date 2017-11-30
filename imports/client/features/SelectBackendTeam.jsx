import React, { Component } from 'react';
import { Radio, Button } from 'antd';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

import UserUtil from '../../util/user';
import Company from '../../schema/company';
import fields from '../../util/fields';


const RadioGroup = Radio.Group;

@pureRender
class SelectBackendTeam extends Component {
    static propTypes = {
        createdCompany: PropTypes.array,
        selectBackendTeam: PropTypes.func,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            value: '',
        };
    }
    onChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    }

    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return (
            <div>
                {
                    this.props.createdCompany[0] ?
                        <div>
                            <RadioGroup onChange={this.onChange} value={this.state.value}>
                                {
                                    this.props.createdCompany.map(item =>
                                        (<Radio
                                            style={radioStyle}
                                            value={item._id}
                                            key={item._id}
                                        >{item.name}</Radio>),
                                    )
                                }
                            </RadioGroup>
                            <br />
                            <br />
                            <Button type="primary" onClick={() => this.props.selectBackendTeam(this.state.value)}>确定</Button>
                        </div>
                        :
                        <div>你还没有创建团队,立即去
                            <span style={{ color: '#29b6f6' }} >创建</span>
                        </div>
                }

            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('company');
    const companyIds = UserUtil.getCreatedCompany();
    const createdCompany = companyIds.map(_id =>
        Company.findOne({ _id }, { fields: fields.createdcompany }),
    );
    return {
        createdCompany,
    };
})(SelectBackendTeam);
