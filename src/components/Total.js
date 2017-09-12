const {h} = require('preact');
const styled = require('styled-components').default;
const CountTo = require('react-count-to').default;
const Bar = require('./Bar');

const MIN = 0;
const MAX = 1;

function Total({label, groups, reducer, shouldTransition}) {
  const value = Math.min(MAX, Math.max(MIN, reducer(groups))); 
  const previousValue = this._cachedValue || value;

  this._cachedValue = value;

  return (
    <Container>
      <Value>
        <CountTo from={previousValue * 100} to={value * 100} digits={1} speed={shouldTransition ? 500 : 0} />%
      </Value>
      {label}
      <Bar value={value} shouldTransition={shouldTransition} />
    </Container>
  );
}

module.exports = Total;

const Container = styled.div`
  position: relative;
  text-align: center;
`;

const Value = styled.div`
  color: ${props => props.theme.primary};
  font-size: 2.5rem;
  font-family: ${props => props.theme.fontSerif};
  font-weight: bold;
  line-height: 1;

  @media (max-height: 30rem) {
    display: inline-block;
    width: 2.75rem;
    font-size: 1rem;

    & ~ * {
      display: none;
    }
  }
`;
