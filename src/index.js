import { whenOdysseyLoaded } from '@abcnews/env-utils';
import { loadScrollyteller } from '@abcnews/scrollyteller';
import { csv } from 'd3-request';
import React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'styled-components';
import Graphic from './components/Graphic';
import { theme } from './styles';

const DATA_URL = `${__webpack_public_path__}data.csv`;

const getData = () =>
  new Promise((resolve, reject) => {
    csv(DATA_URL, (error, data) => {
      if (error) {
        return reject(error);
      }

      resolve(
        data.reduce((memo, row) => {
          memo[row.id] = row;

          return memo;
        }, {})
      );
    });
  });

Promise.all([getData(), whenOdysseyLoaded]).then(([data]) => {
  const scrollyData = loadScrollyteller('', 'u-full');

  render(
    <ThemeProvider theme={theme}>
      <Graphic data={data} scrollyData={scrollyData} />
    </ThemeProvider>,
    scrollyData.mountNode
  );
});
