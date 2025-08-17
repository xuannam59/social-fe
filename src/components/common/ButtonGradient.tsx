import type { ButtonProps } from 'antd/es/button';
import Button from 'antd/es/button';
import React from 'react';

interface IProps extends ButtonProps {
  className?: string;
  form?: string;
  to?: string;
  children: React.ReactNode;
}

const ButtonGradient = (props: IProps) => {
  const { className, children, form, to, ...buttonProps } = props;
  return (
    <Button
      className={`${className} !border-none !bg-gradient-to-r hover:opacity-80 
      ${form ?? 'from-primary'} ${to ?? 'to-secondary'}
      `}
      {...buttonProps}
    >
      <span className="text-white font-normal text-md">{children}</span>
    </Button>
  );
};

export default ButtonGradient;
