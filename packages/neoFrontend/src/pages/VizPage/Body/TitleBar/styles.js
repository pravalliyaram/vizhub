import styled from 'styled-components';

export const Wrapper = styled.div`
  margin: 20px 0 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.div`
  font-size: 20px;
`;

export const Voter = styled.div`
  display: flex;
  align-items: center;
  font-size: 10px;
  user-select: none;
`;

export const VoteIcon = styled.div`
  margin-left: 12px;
  margin-right: 3px;
  line-height: 1;
  cursor: pointer;
  &:hover {
    background-color: blue;
  }
`;
