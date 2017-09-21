const {injectGlobal} = require('styled-components');

const theme = module.exports.theme = {
  fontSans: 'ABCSans, sans-serif',
  fontSerif: 'ABCSerif, serif',
  text: '#5C6C70',
  white: '#F9F9F9',
  grey: '#D9DFE0',
  greyLight: '#ECEFEF',
  primary: '#10414D',
  primaryDark: '#2E3638',
  group1FG: '#007D99',
  group1BG: '#3EBCD9',
  group2FG: '#C44B00',
  group2BG: '#D97D3F',
  group3FG: '#07856E',
  group3BG: '#40B8A3',
  bezier: 'cubic-bezier(0.42, 0, 0.58, 1)'
};

injectGlobal`
@media (min-width: 43.75rem) {
  .Block {
    background-color: transparent;

    &.is-richtext {
      background-color: transparent;
    }
  }
}

.scrollyteller-stage {
  display: flex;
  justify-content: center;
  align-items: stretch;
  background-color: ${theme.white};

  @media (min-width: 43.75rem) {
    align-items: center;
  }

  & > * {
    margin: 2.75rem auto;
    width: 100%;
    max-width: 24.5rem;
  }
}

.Block.is-piecemeal > .Block-content:last-child {
  margin-bottom: 125vh;
}

@media (min-width: 61.25rem) {
  .Block.is-left .scrollyteller-stage > * {
    transform: translate(18.125rem, 0);
  }
  
  .Block.is-right .scrollyteller-stage > * {
    transform: translate(-18.125rem, 0);
  }

  .Block.is-left .Block-content::before,
  .Block.is-right .Block-content::before {
    content: none;
  }

  .Block.is-piecemeal {
    & > .Block-content:nth-child(2) {
      margin-top: calc(50vh - 16rem);
    }

    & > .Block-content:last-child {
      margin-bottom: 75vh;
    }
  }
}


`;
