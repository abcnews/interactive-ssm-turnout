const {h, Component} = require('preact');
const styles = require('./Chart.css');

class Chart extends Component {
  render({groups, isInteractive}) {
    relaxLabels(groups);

    const minXLabel = Math.min.apply(Math, groups.map(group => group.xLabel));
    const maxXLabel = Math.max.apply(Math, groups.map(group => group.xLabel));
    const minYLabel = Math.min.apply(Math, groups.map(group => group.yLabel));
    const maxYLabel = Math.max.apply(Math, groups.map(group => group.yLabel));

    const midGridines = [
      <div className={styles.midXGridline}></div>,
      <div className={styles.midYGridline}></div>
    ];

    const extentLabels = [
      <div className={styles.minLabel}>{minXLabel <= 0 || minYLabel <= 0 ? '' : '0%'}</div>,
      <div className={styles.maxXLabel}>{maxXLabel > 90 ? '' : '100%'}</div>,
      <div className={styles.maxYLabel}>{maxYLabel > 94 ? '' : '100%'}</div>
    ];

    const groupGridlines = [];
    const groupLabels = [];
    const groupPoints = [];

    groups.forEach(group => {
      groupGridlines.push(
        <div className={styles[`group${group.key}XGridline`]} style={{left: `${group.x}%`, height: `${group.y}%`}}></div>,
        <div className={styles[`group${group.key}YGridline`]} style={{width: `${group.x}%`, bottom: `${group.y}%`}}></div>
      );
      groupLabels.push(
        <div className={styles[`group${group.key}XLabel`]} style={{left: `${group.xLabel}%`}}>{group.x}%</div>,
        <div className={styles[`group${group.key}YLabel`]} style={{bottom: `${group.yLabel}%`}}>{group.y}%</div>
      );
      groupPoints.push(
        <div key={group.key}
             className={styles[isInteractive ? 'interactiveGroupPoint' : 'groupPoint']}
             style={{left: `${group.x}%`, bottom: `${group.y}%`}}>
          <div className={styles[`group${group.key}Shape`]}></div>
        </div>
      );
    });

    const gridChildren = midGridines
      .concat(groupGridlines)
      .concat(extentLabels)
      .concat(groupLabels)
      .concat(groupPoints);

    return (
      <div className={styles.root}>
        <div className={styles.xAxisName}>Percent of voter turnout</div>
        <div className={styles.grid}>
          {midGridines
          .concat(groupGridlines)
          .concat(extentLabels)
          .concat(groupLabels)
          .concat(groupPoints)}
        </div>
        <div className={styles.yAxisName}>Percent of ‘Yes’ votes</div>
        <div className={styles.legend}>{groups.map(group => 
          <div className={styles.legendItem}>
            <div className={styles[`group${group.key}Shape`]}></div>
            <div className={styles[`group${group.key}Text`]}>{group.name}</div>
          </div>
        )}</div>
      </div>
    );
  }
}

module.exports = Chart;

function relaxLabels(groups) {
  const maxIterations = 10;
  const shift = .5;

  groups.forEach(group => {
    group.xLabel = group.x;
    group.yLabel = group.y;
  });

  (function relax(iteration) {
    let shouldIterate;

    groups.forEach((a, i) => {
      const aX = a.xLabel;
      const aY = a.yLabel;

      groups.slice(i + 1).forEach(b => {
        const bX = b.xLabel;
        const bY = b.yLabel;
        const diffX = aX - bX;
        const diffY = aY - bY;
        const xChars = (String(Math.round(aX)) + String(Math.round(bX))).length + 2;

        if (Math.abs(diffX) < xChars * 1.55) {
          const signX = diffX > 0 ? 1 : -1;

          a.xLabel = aX + signX * shift;
          b.xLabel = bX - signX * shift;

          shouldIterate = true;
        }

        if (Math.abs(diffY) < 5) {
          const signY = diffY > 0 ? 1 : -1;

          a.yLabel = aY + signY * shift;
          b.yLabel = bY - signY * shift;

          shouldIterate = true;
        }
      });
    });

    if (shouldIterate && iteration < maxIterations) {
      relax(iteration + 1);
    }
  })(0);
}
