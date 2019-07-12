import React, { useState, useEffect } from 'react';
import { LogoSVG } from '../svg';
import { LoadingScreenWrapper, SpinningLogo, Message } from './styles';
import { blankScreenDelay } from './animationDelay';
export { animationDelay } from './animationDelay';
export { blankScreenDelay };

export const LoadingScreen = ({ message }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShow(true);
    }, blankScreenDelay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return show ? (
    <LoadingScreenWrapper>
      <SpinningLogo>
        <LogoSVG />
      </SpinningLogo>
      {message ? <Message>{message}</Message> : null}
    </LoadingScreenWrapper>
  ) : null;
};
