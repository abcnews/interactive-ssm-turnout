const {h, Component} = require('preact');
const Total = require('../Total');
const Chart = require('../Chart');
const styles = require('./Graphic.css');

class Graphic extends Component {
  constructor() {
    super();

    this.state = {
      isInteractive: false,
      total: 46,
      groups: [
        {key: 1, name: 'Age 18-34', x: 65, y: 78},
        {key: 2, name: 'Age 35-54', x: 56, y: 79},
        {key: 3, name: 'Age 55+', x: 50, y: 87}
      ]
    };

    setTimeout(() => {
      this.state.groups[0].x = Math.floor(Math.random() * 100);
      this.state.groups[0].y = Math.floor(Math.random() * 100);
      this.state.groups[1].x = Math.floor(Math.random() * 100);
      this.state.groups[1].y = Math.floor(Math.random() * 100);
      this.state.groups[2].x = Math.floor(Math.random() * 100);
      this.state.groups[2].y = Math.floor(Math.random() * 100);
      this.setState();
    }, 1000);

    setTimeout(() => {
      this.setState({
        isInteractive: true
      });
    }, 2000);
  }

  updateGroup(key, x, y) {
    this.state.groups
    .filter(group => group.key === key)
    .forEach((group, index) => {
      group.x = x;
      group.y = y;
    });

    this.setState();
  }

  render({}, {isInteractive, total, groups}) {
    return (
      <div className={styles.root}>
        <Total value={total} />
        <Chart groups={groups} isInteractive={isInteractive} updateGroup={this.updateGroup.bind(this)} />
      </div>
    );
  }
}

module.exports = Graphic;
