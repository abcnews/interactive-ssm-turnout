const {h, Component} = require('preact');
const CountTo = require('react-count-to').default;
const styles = require('./Total.css');

class Total extends Component {
  componentWillReceiveProps() {
    this._previousValue = this
  }

  render({groups, shouldTransition}) {
    const value = groups.length === 0 ? 0 :
      groups.reduce((memo, group) => memo + (group.p * group.x * group.y), 0) /
      groups.reduce((memo, group) => memo + group.p, 0) / 100; 
    
    const previousValue = this._cachedValue || 0;

    this._cachedValue = value;

    return (
      <div className={styles.root}>
        <div className={styles.value}>
          <CountTo from={previousValue} to={value} speed={shouldTransition ? 500 : 0} />%
        </div>
        of the total votes are ‘Yes’
        <div className={styles.bar}>
          <progress className={`${styles.fill} ${shouldTransition ? styles.shouldTransition : ''}`} value={value} max={100} />
          <progress className={`${styles.tick} ${shouldTransition ? styles.shouldTransition : ''}`} value={value} max={100} />
        </div>
      </div>
    );
  }
}

module.exports = Total;
