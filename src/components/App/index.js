const {h, Component} = require('preact');
const Graphic = require('../Graphic');

class App extends Component {
  render() {
    return (
      <Graphic />
    );
  }
}

module.exports = App;
