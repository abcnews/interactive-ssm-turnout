const animate = require('nanoanimation');
const {h, Component} = require('preact');
const styles = require('./Chart.css');

const ANIMATION_OPTIONS = {
  duration: 500,
  easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
  fill: 'forwards'
};

class Chart extends Component {
  getAnimatableEls() {
    return Array.from(this.base.querySelectorAll(`
      .${styles.groupPoint},
      .${styles.label},
      .${styles.groupGridline}
    `));
  }

  componentWillUpdate() {
    this.getAnimatableEls()
    .forEach(el => el.dataset.from = JSON.stringify({
      opacity: el.style.opacity,
      transform: window.getComputedStyle(el).transform,
      width: el.style.width,
      height: el.style.height,
      left: el.style.left,
      bottom: el.style.bottom
    }));
  }

  componentDidUpdate() {
    this.getAnimatableEls()
    .forEach((el, index) => {
      const from = JSON.parse(el.dataset.from);
      const to = {
        opacity: el.style.opacity,
        transform: window.getComputedStyle(el).transform,
        width: el.style.width,
        height: el.style.height,
        left: el.style.left,
        bottom: el.style.bottom
      };

      if (
        from.opacity !== to.opacity ||
        from.transform !== to.transform ||
        from.width !== to.width ||
        from.height !== to.height ||
        from.left !== to.left ||
        from.bottom !== to.bottom
      ) {
        animate(el, [from, to], ANIMATION_OPTIONS).play();
      }

      delete el.dataset.from;
    });
  }

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
      <div className={styles.minLabel} style={{opacity: minXLabel <= 0 || minYLabel <= 0 ? 0 : 1}}>0%</div>,
      <div className={styles.maxXLabel} style={{opacity: maxXLabel > 90 ? 0 : 1}}>100%</div>,
      <div className={styles.maxYLabel} style={{opacity: maxYLabel > 94 ? 0 : 1}}>100%</div>,
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
        <div className={styles[`group${group.key}XLabel`]} data-text={`${group.x}%`} style={{left: `${group.xLabel}%`}}>{group.x}%</div>,
        <div className={styles[`group${group.key}YLabel`]} data-text={`${group.y}%`} style={{bottom: `${group.yLabel}%`}}>{group.y}%</div>
      );
      groupPoints.push(
        <div key={group.key}
             className={styles[isInteractive ? 'interactiveGroupPoint' : 'groupPoint']}
             style={{left: `${group.x}%`, bottom: `${group.y}%`}}>
          <div className={styles[`group${group.key}Shape`]}></div>
        </div>
      );
    });

    return (
      <div className={styles.root}>
        <div className={styles.xAxisName}>Percent of voter turnout</div>
        <div className={styles.grid}>
          {midGridines
          .concat(groupGridlines)
          .concat(extentLabels)
          .concat(groupPoints)
          .concat(groupLabels)}
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
