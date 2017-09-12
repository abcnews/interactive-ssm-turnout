const {h, render} = require('preact');
const {ThemeProvider} = require('styled-components');
const {theme} = require('./styles');

const root = document.querySelector('[data-interactive-ssm-turnout-root]');

function init() {
  const Graphic = require('./components/Graphic');

  const stage = document.querySelector('.scrollyteller-stage');

  if (stage === null) {
    return setTimeout(init, 100);
  }

  if (root.parentElement !== stage) {
    stage.appendChild(root);
  }

  render(
    <ThemeProvider theme={theme}>
      <Graphic dataURL={root.dataset.data} scrollyteller={stage.__SCROLLYTELLER__} />
    </ThemeProvider>,
    root,
    root.firstChild
  );
}

init();

if (module.hot) {
  module.hot.accept('./components/Graphic', () => {
    try {
      init();
    } catch (err) {
      const ErrorBox = require('./components/ErrorBox');

      render(<ErrorBox error={err} />, root, root.firstChild);
    }
  });
}

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools');
}
