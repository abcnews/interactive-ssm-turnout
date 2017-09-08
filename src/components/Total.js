const {h} = require('preact');
const styled = require('styled-components').default;
const CountTo = require('react-count-to').default;
const Bar = require('./Bar');

const MIN = 0;
const MAX = 100;

function Total({label, groups, reducer, shouldTransition}) {
  const pct = Math.min(MAX, Math.max(MIN, reducer(groups))); 
  const previousPct = this._cachedPct || MIN;

  this._cachedPct = pct;

  return (
    <Container>
      <Value>
        <CountTo from={previousPct} to={pct} digits={1} speed={shouldTransition ? 500 : 0} />%
      </Value>
      {label}
      <Bar value={pct} max={100} shouldTransition={shouldTransition} />
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
