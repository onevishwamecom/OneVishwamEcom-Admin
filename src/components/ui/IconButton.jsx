import React from 'react';
import Button from './Button';

/**
 * Reusable IconButton component for square/circular icon actions.
 */
export function IconButton({
  icon,
  size = 'icon',
  variant = 'secondary',
  title,
  'aria-label': ariaLabel,
  ...props
}) {
  return (
    <Button
      icon={icon}
      size={size}
      variant={variant}
      title={title || ariaLabel}
      aria-label={ariaLabel || title}
      {...props}
    />
  );
}

export default IconButton;
