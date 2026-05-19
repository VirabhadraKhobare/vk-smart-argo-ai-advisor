/**
 * AlertBanner Component
 * Reusable alert/notification banner
 */
import React from 'react';
import { Alert } from 'react-bootstrap';
import { RiInformationLine, RiErrorWarningLine, RiCheckboxCircleLine, RiAlertLine } from 'react-icons/ri';

const AlertBanner = ({ 
  variant = 'info', 
  title, 
  message, 
  onClose,
  icon: CustomIcon 
}) => {
  const icons = {
    info: RiInformationLine,
    warning: RiErrorWarningLine,
    success: RiCheckboxCircleLine,
    danger: RiAlertLine
  };

  const Icon = CustomIcon || icons[variant] || RiInformationLine;

  return (
    <Alert 
      variant={variant} 
      dismissible={!!onClose} 
      onClose={onClose}
      className="d-flex align-items-center gap-2"
      style={{ borderRadius: '12px', border: 'none' }}
    >
      <Icon size={20} />
      <div>
        {title && <Alert.Heading className="h6 mb-1">{title}</Alert.Heading>}
        {message}
      </div>
    </Alert>
  );
};

export default AlertBanner;
