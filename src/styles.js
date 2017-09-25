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
  group4FG: '#2E3638', // Demo
  group4BG: '#10414D', // Demo
  bezier: 'cubic-bezier(0.42, 0, 0.58, 1)'
};

const graphicEstimatedHeight = 30; // rem
const graphicCenterOffset = 18.125; // rem

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
  .Block .scrollyteller-stage > * {
    transition: transform .75s ${theme.bezier};
  }

   .Block.is-left .scrollyteller-stage > * {
    transform: translate(0, calc(-33.33vh + ${graphicEstimatedHeight / 3}rem));
  }
    
  .Block.is-right .scrollyteller-stage > * {
    transform: translate(0, calc(-33.33vh + ${graphicEstimatedHeight / 3}rem));
  }

  .Block.is-left .Block-media.is-fixed .scrollyteller-stage > * {
    transform: translate(${graphicCenterOffset}rem, 0);
  }
    
  .Block.is-right .Block-media.is-fixed .scrollyteller-stage > * {
    transform: translate(-${graphicCenterOffset}rem, 0);
  }

  .Block.is-left .Block-media.is-beyond .scrollyteller-stage > *,
  .Block.is-right .Block-media.is-beyond .scrollyteller-stage > * {
    transform: none;
  }

  .Block.is-left .Block-content::before,
  .Block.is-right .Block-content::before {
    content: none;
  }

  .Block.is-piecemeal {
    & > .Block-content:nth-child(2) {
      margin-top: 100vh;
    }

    & > .Block-content:last-child {
      margin-bottom: 75vh;
    }
  }
}


`;
