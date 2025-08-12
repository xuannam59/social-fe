import HeaderMenu from './HeaderMenu';
import HeaderSearch from './HeaderSearch';
import HeaderUserInfo from './HeaderUserInFo';

const Header = () => {
  return (
    <>
      <div className="sticky top-0 z-10 bg-white h-14 shadow-sm">
        <header className="flex items-center justify-between h-full gap-4 px-4">
          {/* Left */}
          <HeaderSearch />

          {/* Center Menu*/}
          <HeaderMenu />

          {/* Right */}
          <HeaderUserInfo />
        </header>
      </div>
    </>
  );
};

export default Header;
