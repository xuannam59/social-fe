import { callApiGetAccount } from '@social/apis/auths.api';
import LoadingPage from '@social/components/loading/LoadingPage';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import {
  doGetAccount,
  setIsLoading,
} from '@social/redux/reducers/auth.reducer';
import { useCallback, useEffect, useRef } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { SocketProvider } from '@social/providers/SocketProvider';

const RouterPrivate = () => {
  const dispatch = useAppDispatch();
  const count = useRef(0);
  const { isLoading } = useAppSelector(state => state.auth);
  const [queryParams, setQueryParams] = useSearchParams();
  const userInfo = useAppSelector(state => state.auth.userInfo);

  const getAccount = useCallback(async () => {
    const accessToken = queryParams.get('access_token');
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      setQueryParams({});
    }
    const res = await callApiGetAccount();
    if (res.data) {
      dispatch(doGetAccount(res.data));
      dispatch(setIsLoading(false));
    }
  }, [dispatch, queryParams, setQueryParams]);

  useEffect(() => {
    if (count.current === 0) {
      getAccount();
      count.current++;
    }
  }, [getAccount]);
  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <SocketProvider userInfo={userInfo}>
          <Outlet />
        </SocketProvider>
      )}
    </>
  );
};

export default RouterPrivate;
