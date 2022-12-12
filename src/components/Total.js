import React from 'react';
import styled from 'styled-components';
import Bar from './Bar';

const MIN = 0;
const MAX = 1;

const Container = styled.div`
  position: relative;
  text-align: center;
`;

const Value = styled.div`
  color: ${(props) => props.theme.primary};
  font-size: 2.5rem;
  font-family: ${(props) => props.theme.fontSerif};
  font-weight: bold;
  line-height: 1;

  > sup {
    font-size: 66.67%;
  }

  @media (max-height: 30rem) {
    display: inline-block;
    width: 2.75rem;
    font-size: 1rem;

    & ~ * {
      display: none;
    }
  }
`;

function Total({ label, groups, reducer, shouldTransition }) {
  const value = Math.min(MAX, Math.max(MIN, reducer(groups))) || 0;

  return (
    <Container>
      <Value>
        <span>{Math.floor(value * 100)}</span>
        <sup>%</sup>
      </Value>
      {label}
      <Bar value={value} shouldTransition={shouldTransition} />
    </Container>
  );
}

export default Total;
