const {h, Component} = require('preact');
const Total = require('../Total');
const Chart = require('../Chart');
const styles = require('./Graphic.css');

// Dummy data
const data = {
  total: 46,
  groups: [
    {key: 1, name: 'Age 18-34', x: 65, y: 78},
    {key: 2, name: 'Age 35-54', x: 56, y: 79},
    {key: 3, name: 'Age 55+', x: 50, y: 87}
  ]
};

class Graphic extends Component {
  render() {
    return (
      <div className={styles.root}>
        <Total value={data.total} />
        <Chart groups={data.groups} isInteractive={false} />
      </div>
    );
  }
}

module.exports = Graphic;
