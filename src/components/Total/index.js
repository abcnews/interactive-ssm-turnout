const {h, Component} = require('preact');
const CountTo = require('react-count-to').default;
const styles = require('./Total.css');

class Total extends Component {
  componentWillReceiveProps() {
    this._previousValue = this
  }

  render({groups}) {
    const value = groups.length ? (
     (groups[0].p * groups[0].x * groups[0].y) +
     (groups[1].p * groups[1].x * groups[1].y) +
     (groups[2].p * groups[2].x * groups[2].y)
    ) / (groups[0].p + groups[1].p + groups[2].p) / 100 : 0;
    
    const previousValue = this._cachedValue || 0;

    this._cachedValue = value;

    return (
      <div className={styles.root}>
        {/*<div className={styles.value}>{Math.floor(value)}%</div>*/}
        <div className={styles.value}>
          <CountTo from={previousValue} to={value} speed={500} />%
        </div>
        of the total votes are ‘Yes’
        <div className={styles.bar}>
          <progress className={styles.fill} value={value} max={100} />
          <progress className={styles.tick} value={value} max={100} />
        </div>
      </div>
    );
  }
}

module.exports = Total;
