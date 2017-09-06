const {h} = require('preact');
const CountTo = require('react-count-to').default;
const Bar = require('../Bar');
const styles = require('./Total.css');

const MIN = 0;
const MAX = 100;

function Total({label, groups, reducer, shouldTransition}) {
  const pct = Math.min(MAX, Math.max(MIN, reducer(groups))); 
  const previousPct = this._cachedPct || MIN;

  this._cachedPct = pct;

  return (
    <div className={styles.root}>
      <div className={styles.value}>
        <CountTo from={previousPct} to={pct} speed={shouldTransition ? 500 : 0} />%
      </div>
      {label}
      <Bar value={pct} max={100} shouldTransition={shouldTransition} />
    </div>
  );
}

module.exports = Total;
