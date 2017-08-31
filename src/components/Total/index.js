const {h, Component} = require('preact');
const styles = require('./Total.css');

class Total extends Component {
  render({value}) {
    return (
      <div className={styles.root}>
        <div className={styles.value}>{Math.floor(value)}%</div>
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
