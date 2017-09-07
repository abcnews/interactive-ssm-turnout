const {h} = require('preact');
const styled = require('styled-components').default;

const MIN = 0;
const MAX = 1;

const Container = styled.div`
  position: relative;
  height: 2rem;
`;

const Progress = styled.progress`
  appearance: none;
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 0;
  border: none;
  padding: 0;
  width: 100%;

  &::-webkit-progress-bar {
    background: none;
  }

  &::-webkit-progress-value {
    transition: ${props => props.shouldTransition ? `width .5s ${props.theme.bezier}` : 'none'}
  }

  &::-ms-fill {
    transition: ${props => props.shouldTransition ? `width .5s ${props.theme.bezier}` : 'none'}
  }
`;

const Fill = styled(Progress)`
  height: 1.5625rem;
  background: ${props => props.theme.greyLight};
  box-shadow: inset 0 0 0 .125rem ${props => props.theme.grey};
  color: ${props => props.theme.primary};

  &::-webkit-progress-value {
    background: ${props => props.theme.primary};
  }

  &::-moz-progress-bar {
    background: ${props => props.theme.primary};
  }

  &::-ms-fill {
    background: ${props => props.theme.primary};
  }
`;

const Tick = styled(Progress)`
  height: 1.875rem;
  background: none;

  &::-webkit-progress-value {
    border-right: .125rem solid ${props => props.theme.primaryDark};
    background: none;
  }

  &::-moz-progress-bar {
    border-right: .125rem solid ${props => props.theme.primaryDark};
    background: none;
  }

  &::-ms-fill {
    border-right: .125rem solid ${props => props.theme.primaryDark};
    background: none;
  }
`;
`


`;

function Bar({value = MIN, max = MAX, shouldTransition}) {
  return (
    <Container>
      <Fill shouldTransition={shouldTransition} value={value} max={max} />
      <Tick shouldTransition={shouldTransition} value={value} max={max} />
    </Container>
  );
}

module.exports = Bar;
