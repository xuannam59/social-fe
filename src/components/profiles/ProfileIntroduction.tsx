import type { IUser } from '@social/types/user.type';
import { TbMapPin, TbUsersGroup, TbUserSquare } from 'react-icons/tb';

interface IProps {
  userProfile: IUser;
}

const ProfileIntroduction: React.FC<IProps> = ({ userProfile }) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="mb-4">
          <span className="text-h3 font-bold">Giới thiệu</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-start items-center gap-3">
            <TbUserSquare size={24} className="text-gray-500" />
            <div>
              <span className="text-base font-semibold">Trang cá nhân</span>
              {` · `}
              <span className="text-base text-gray-500">
                Người sáng tạo nội dung số
              </span>
            </div>
          </div>
          {userProfile.followers.length > 0 && (
            <div className="flex justify-start items-center gap-3">
              <TbUsersGroup size={24} className="text-gray-500" />
              <div>
                <span className="text-base text-gray-500">
                  Có{' '}
                  <span className="text-black font-semibold">
                    {userProfile.followers.length}
                  </span>{' '}
                  người theo dõi
                </span>
              </div>
            </div>
          )}
          {userProfile.address && (
            <div className="flex justify-start items-center gap-3">
              <TbMapPin size={24} className="text-gray-500" />
              <div>
                <span className="text-base text-gray-500">Đến từ</span>
                {` · `}
                <span className="text-base font-semibold">
                  {userProfile.address}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileIntroduction;
