const {h, Component} = require('preact');
const CountTo = require('react-count-to').default;
const styles = require('./Total.css');

class Total extends Component {
  render({label, groups, reducer, shouldTransition}) {
    const pct = reducer(groups); 
    const previousPct = this._cachedPct || 0;

    this._cachedPct = pct;

    return (
      <div className={styles.root}>
        <div className={styles.value}>
          <CountTo from={previousPct} to={pct} speed={shouldTransition ? 500 : 0} />%
        </div>
        {label}
        <div className={styles.bar}>
          <progress className={`${styles.fill} ${shouldTransition ? styles.shouldTransition : ''}`} value={pct} max={100} />
          <progress className={`${styles.tick} ${shouldTransition ? styles.shouldTransition : ''}`} value={pct} max={100} />
        </div>
      </div>
    );
  }
}

module.exports = Total;
