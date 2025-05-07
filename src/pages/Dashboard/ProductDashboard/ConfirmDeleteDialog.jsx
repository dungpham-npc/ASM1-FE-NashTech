import React from 'react';
import { Modal, Button } from 'antd';

const ConfirmDeleteDialog = ({ visible, onCancel, onConfirm, name, entity }) => {
    return (
        <Modal
            title="Confirm Delete"
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="delete" type="primary" danger onClick={onConfirm}>
                    Delete
                </Button>,
            ]}
        >
            <p>Are you sure you want to delete the {entity} "{name}"?</p>
            <p>This action cannot be undone.</p>
        </Modal>
    );
};

export default ConfirmDeleteDialog;