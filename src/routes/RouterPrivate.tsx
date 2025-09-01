import { callApiGetAccount } from '@social/apis/auths.api';
import LoadingPage from '@social/components/loading/LoadingPage';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import {
  doGetAccount,
  setIsLoading,
} from '@social/redux/reducers/auth.reducer';
import { useCallback, useEffect, useRef } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';

const RouterPrivate = () => {
  const dispatch = useAppDispatch();
  const count = useRef(0);
  const { isLoading } = useAppSelector(state => state.auth);
  const [queryParams, setQueryParams] = useSearchParams();

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
  return <>{isLoading ? <LoadingPage /> : <Outlet />}</>;
};

export default RouterPrivate;
