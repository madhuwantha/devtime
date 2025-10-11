import React from 'react';
import { Modal } from './Modal';
import { Button } from '../ui/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
}) => {
  const icon = variant === 'danger' ? '⚠️' : '⚠️';
  const confirmVariant = variant === 'danger' ? 'danger' : 'success';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={icon}
      description={message}
    >
      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          {cancelText}
        </Button>
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          className="flex-1"
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
