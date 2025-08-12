import { ROUTES } from '@social/constants/route.constant';
import HeaderSubMenu from './HeaderSubMenu';
import { useEffect, useState } from 'react';
import { TbDeviceTv, TbHome, TbUsersGroup } from 'react-icons/tb';
import { useLocation } from 'react-router-dom';

const HeaderMenu = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const subMenuHeaderDf = [
    {
      icon: <TbHome size={25} />,
      path: ROUTES.DEFAULT,
      title: 'Home',
    },
    {
      icon: <TbDeviceTv size={25} />,
      path: ROUTES.WATCH,
      title: 'Watch',
    },
    {
      icon: <TbUsersGroup size={25} />,
      path: ROUTES.GROUPS,
      title: 'Groups',
    },
  ];

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <div className="flex items-center justify-center h-full gap-4 flex-1">
        {subMenuHeaderDf.map((item, index) => (
          <HeaderSubMenu
            key={index}
            isActive={activeTab === item.path}
            icon={item.icon}
            path={item.path}
            title={item.title}
          />
        ))}
      </div>
    </>
  );
};

export default HeaderMenu;
