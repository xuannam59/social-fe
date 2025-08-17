import { Radio, Typography } from 'antd';
import React from 'react';

interface IProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: string;
  onClick?: () => void;
  selected?: boolean;
}

const { Title, Text } = Typography;

const PrivacyItem: React.FC<IProps> = ({
  icon,
  title,
  description,
  value,
  onClick,
  selected,
}) => {
  return (
    <>
      <div
        className="flex gap-2 items-center hover:bg-gray-100 cursor-pointer rounded-lg py-1 px-2"
        onClick={onClick}
      >
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <Title level={5} className="!mb-0">
            {title}
          </Title>
          <Text type="secondary">{description}</Text>
        </div>
        <Radio value={value} checked={selected} />
      </div>
    </>
  );
};

export default PrivacyItem;
