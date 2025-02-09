import React, { useMemo, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingScreen } from '../../LoadingScreen';
import { ErrorContext } from '../../ErrorContext';
import { NavBar } from '../../NavBar';
import { Wrapper } from '../styles';
import { ProfilePageDataProvider } from './ProfilePageDataContext';
import { Body } from './Body';

export const ProfilePage = () => {
  const { userName } = useParams();
  const { setError: setGlobalError } = useContext(ErrorContext);

  const searchProps = useMemo(() => ({ redirectPath: `/${userName}` }), [
    userName,
  ]);

  return (
    <>
      <NavBar showSearch searchProps={searchProps} />
      <Wrapper>
        <ProfilePageDataProvider
          fallback={<LoadingScreen />}
          onError={setGlobalError}
        >
          <Body />
        </ProfilePageDataProvider>
      </Wrapper>
    </>
  );
};
