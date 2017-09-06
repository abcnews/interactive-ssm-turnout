const {h, Component} = require('preact');
const CountTo = require('react-count-to').default;
const styles = require('./Total.css');

const MIN = 0;
const MAX = 100;

class Total extends Component {
  render({label, groups, reducer, shouldTransition}) {
    const pct = Math.min(MAX, Math.max(MIN, reducer(groups))); 
    const previousPct = this._cachedPct || MIN;

    this._cachedPct = pct;

    return (
      <div className={styles.root}>
        <div className={styles.value}>
          <CountTo from={previousPct} to={pct} speed={shouldTransition ? 500 : 0} />%
        </div>
        {label}
        <div className={styles.bar}>
          <progress className={`${styles.fill} ${shouldTransition ? styles.shouldTransition : ''}`} value={pct} max={MAX} />
          <progress className={`${styles.tick} ${shouldTransition ? styles.shouldTransition : ''}`} value={pct} max={MAX} />
        </div>
      </div>
    );
  }
}

module.exports = Total;
