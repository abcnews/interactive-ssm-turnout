import { injectGlobal } from 'styled-components';

export const theme = {
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
  bezier: 'cubic-bezier(0.42, 0, 0.58, 1)',
};

injectGlobal`
@media (min-width: 43.75rem) {
  [id^="scrollyteller"] {
    background-color: transparent;

    &.is-richtext {
      background-color: transparent;
    }
  }
}

[id^="scrollyteller"] > div > div:first-child {
  display: flex;
  justify-content: center;
  align-items: stretch;
  background-color: ${theme.white};

  @media (min-width: 43.75rem) {
    align-items: center;
  }

  & > * {
    margin-top: 2.75rem;
    margin-bottom: 2.75rem;
    width: 100%;
    max-width: 24.5rem;
  }
}

[id^="scrollyteller"] > div > div:last-child {
  margin-bottom: 125vh;
}

[id^="scrollyteller"] > div > div:first-child ~ div::before {
  background-color: rgba(249, 249, 249, 0.9);
}

[id^="scrollyteller"] > div > div:first-child ~ div p {
  color: #111;
}
`;
