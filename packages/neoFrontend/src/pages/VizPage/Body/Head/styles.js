import styled from 'styled-components';
import { Icon } from '../styles';

export const Wrapper = styled.div`
  height: ${props => props.theme.headHeight}px;
  background-color: #ffffff;
  box-shadow: ${props => props.theme.shadow};

  display: flex;
  justify-content: space-between;
`;

export const Left = styled.div`
  padding-left: 9px;
  display: flex;
  align-items: center;
`;

export const Right = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const HeadIcon = styled(Icon)`
  height: ${props => props.theme.headHeight}px;
  width: 35px;
  margin-right: ${props => (props.rightmost ? 9 : 0)}px;
`;
