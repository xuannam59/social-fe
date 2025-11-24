import { ROUTES } from '@social/constants/route.constant';
import logo from '@social/images/logo.webp';
import { Button } from 'antd';
import { useState } from 'react';
import { TbArrowLeft } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import InputSearch from '../common/InputSearch';

const HeaderSearch = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-start gap-2 h-full">
        <div className="relative w-[50px] h-10 overflow-hidden flex justify-end">
          <img
            src={logo}
            alt="logo"
            className={`absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer
                  h-auto object-contain transition-all duration-300 ease-out ${
                    isSearchFocused
                      ? '-translate-x-6 opacity-0 pointer-events-none'
                      : 'translate-x-0 opacity-100'
                  }`}
            onClick={() => {
              navigate(ROUTES.DEFAULT);
            }}
          />
          <Button
            type="text"
            shape="circle"
            className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${
              isSearchFocused
                ? 'translate-x-0 opacity-100'
                : 'translate-x-6 opacity-0 pointer-events-none'
            }`}
          >
            <TbArrowLeft size={20} className="text-gray-500" />
          </Button>
        </div>
        <div className="hidden md:block">
          <InputSearch
            className="!w-[280px] h-[40px] "
            placeholder="Search on JunSocial"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </div>
    </>
  );
};

export default HeaderSearch;
