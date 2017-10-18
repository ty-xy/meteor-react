import React from 'react';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import PropTypes from 'prop-types';

class View extends React.Component {
    state = {
        isShowingModal: false,
    }
    handleClick = () => this.setState({ isShowingModal: true })
    handleClose = () => this.setState({ isShowingModal: false })
    render() {
        return <div onClick={this.handleClick}>
            {
                this.state.isShowingModal &&
                <ModalContainer onClose={this.handleClose}>
                    <ModalDialog onClose={this.handleClose}>
                        <h1>Dialog Content</h1>
                        <p>More Content. Anything goes here</p>
                    </ModalDialog>
                </ModalContainer>
            }
        </div>;
    }
}