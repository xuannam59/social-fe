import type { InputProps } from 'antd/es/input';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react';
import { debounce } from 'lodash';
import {
  callApiFetchUserFriendList,
  callApiGetFriendByUserId,
  callApiGetUserBySearch,
} from '@social/apis/user.api';
import { Dropdown, Input } from 'antd';
import { TbLoader2, TbSearch } from 'react-icons/tb';
import type { IUserTag } from '@social/types/user.type';
import { convertSlug } from '@social/common/convert';
import AvatarUser from './AvatarUser';
import { useNavigate } from 'react-router-dom';

interface IProps extends InputProps {
  className?: string;
}

const InputSearch: React.FC<IProps> = ({ className, ...inputProps }) => {
  const [listSearch, setListSearch] = useState<IUserTag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const navigate = useNavigate();
  const debouncedFetch = useMemo(
    () =>
      debounce(async (value: string) => {
        try {
          setIsLoading(true);
          const slug = convertSlug(value);
          const res = await callApiGetUserBySearch(slug);
          if (res.data) {
            setListSearch(res.data);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }, 500),
    [setListSearch]
  );

  const fetchRecentSearch = useCallback(async () => {
    try {
      const res = await callApiFetchUserFriendList('limit=5');
      if (res.data) {
        setListSearch(res.data.friends);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  useEffect(() => {
    fetchRecentSearch();
  }, [fetchRecentSearch]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      debouncedFetch(value);
    },
    [debouncedFetch]
  );

  const handleNavigate = useCallback(
    (user: IUserTag) => {
      navigate(`/${user._id}`);
      setIsOpenDropdown(false);
    },
    [navigate]
  );

  return (
    <>
      <div className="relative">
        <Dropdown
          trigger={['click']}
          open={isOpenDropdown}
          onOpenChange={setIsOpenDropdown}
          placement="bottomLeft"
          popupRender={() => {
            return (
              <div
                className={`max-h-[200px] bg-white rounded-b-lg shadow-md overflow-y-auto py-2`}
              >
                {isLoading ? (
                  <div className="flex items center justify-center p-2">
                    <TbLoader2 size={20} className="animate-spin" />
                  </div>
                ) : listSearch.length > 0 ? (
                  <div className="">
                    <div className="flex justify-between items-center p-2">
                      <span className="text-base font-medium">Tìm kiếm</span>
                    </div>
                    <div className="flex flex-col px-2">
                      {listSearch.map(item => (
                        <div
                          key={item._id}
                          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                          onClick={() => handleNavigate(item)}
                        >
                          <AvatarUser
                            avatar={item.avatar}
                            size={42}
                            className="cursor-pointer"
                          />
                          <span className="text-base cursor-pointer">
                            {item.fullname}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items center justify-center p-2">
                    <span className="text-base text-gray-500">
                      Không có tìm kiếm nào gần đây
                    </span>
                  </div>
                )}
              </div>
            );
          }}
        >
          <Input
            {...inputProps}
            className={`${className} !rounded-full !border-none !bg-gray-100 !ring-0`}
            prefix={<TbSearch size={20} className="text-gray-500" />}
            onChange={handleChange}
          />
        </Dropdown>
      </div>
    </>
  );
};

export default InputSearch;
