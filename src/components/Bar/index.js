const {h} = require('preact');
const styles = require('./Bar.css');

const MIN = 0;
const MAX = 1;

function Bar({value = MIN, max = MAX, shouldTransition}) {
  return (
    <div className={styles.root}>
      <progress className={`${styles.fill} ${shouldTransition ? styles.shouldTransition : ''}`} value={value} max={max} />
      <progress className={`${styles.tick} ${shouldTransition ? styles.shouldTransition : ''}`} value={value} max={max} />
    </div>
  );
}

module.exports = Bar;
