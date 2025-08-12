import { callApiGetAccount } from '@social/apis/auths.api';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import {
  doGetAccount,
  setIsLoading,
} from '@social/redux/reducers/auth.reducer';
import { useCallback, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../headers/Header';
import LoadingPage from '../loading/LoadingPage';

const DefaultLayout = () => {
  const dispatch = useAppDispatch();
  const count = useRef(0);
  const { isLoading } = useAppSelector(state => state.auth);
  const getAccount = useCallback(async () => {
    dispatch(setIsLoading(true));
    const res = await callApiGetAccount();
    if (res.data) {
      dispatch(doGetAccount(res.data));
    }
    dispatch(setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (count.current === 0) {
      getAccount();
      count.current++;
    }
  }, [getAccount]);

  return (
    <div className="min-h-screen bg-gray-100 w-full max-w-full">
      {isLoading ? (
        <LoadingPage />
      ) : (
        <>
          <Header />
          <div className="mt-4">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};

export default DefaultLayout;
