import HeaderMenu from './HeaderMenu';
import HeaderSearch from './HeaderSearch';
import HeaderUserInfo from './HeaderUserInFo';

const Header = () => {
  return (
    <>
      <div className="sticky top-0 z-10 bg-white h-14 shadow-sm">
        <header className="grid grid-cols-13 items-center justify-between h-full gap-4 px-4">
          {/* Left */}
          <div className="col-span-4 h-full">
            <HeaderSearch />
          </div>

          {/* Center Menu*/}
          <div className="col-span-5 h-full">
            <HeaderMenu />
          </div>

          {/* Right */}
          <div className="col-span-4 h-full">
            <HeaderUserInfo />
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
