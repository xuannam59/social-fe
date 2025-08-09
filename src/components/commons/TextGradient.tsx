import { Typography } from 'antd';
import type { TextProps } from 'antd/es/typography/Text';
import React from 'react';

interface IProps extends TextProps {
  className?: string;
  form?: string;
  to?: string;
  children: React.ReactNode;
}

const { Text } = Typography;

const TextGradient = (props: IProps) => {
  const { className, children, form, to, ...textProps } = props;

  return (
    <Text
      className={`
        ${className} font-bold !text-transparent bg-clip-text bg-gradient-to-r 
        ${form ?? 'from-primary'} ${to ?? 'to-secondary'}
      `}
      {...textProps}
    >
      {children}
    </Text>
  );
};

export default TextGradient;
