import { Tooltip } from 'antd';
import React from 'react';

import { Link } from 'react-router-dom';

interface IProps {
  isActive: boolean;
  icon: React.ReactNode;
  path: string;
  title?: string;
}

const SubMenuHeader: React.FC<IProps> = ({ isActive, icon, path, title }) => {
  return (
    <>
      <Tooltip title={title} placement="bottom" arrow={false}>
        <div className="flex-1/4 relative h-full group/home cursor-pointer py-1">
          <Link to={path}>
            <div
              className={`rounded-md w-full h-full flex items-center justify-center 
                  ${!isActive && 'hover:bg-gray-200'}
                  ${isActive ? 'text-blue-500' : 'text-gray-500'}`}
            >
              {icon}
            </div>
          </Link>
          <div
            className={`absolute bottom-0 left-0 w-full h-[2px] from-secondary to-primary bg-gradient-to-r ${
              isActive ? 'block' : 'hidden'
            }`}
          />
        </div>
      </Tooltip>
    </>
  );
};

export default SubMenuHeader;
