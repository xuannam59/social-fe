import HeaderMenu from './HeaderMenu';
import HeaderSearch from './HeaderSearch';
import HeaderUserInfo from './HeaderUserInFo';

const Header = () => {
  return (
    <>
      <div className="sticky top-0 z-10 bg-white h-14 shadow-sm">
        <header className="flex items-center justify-between h-full gap-4 px-4">
          {/* Left */}
          <div className="w-[360px] h-full">
            <HeaderSearch />
          </div>

          {/* Center Menu*/}
          <div className="flex-1 justify-center h-full hidden lg:flex">
            <div className="w-[680px]">
              <HeaderMenu />
            </div>
          </div>

          {/* Right */}
          <div className="w-[360px] h-full">
            <HeaderUserInfo />
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
