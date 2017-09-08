const {csv} = require('d3-request');
const {h, Component} = require('preact');
const styled = require('styled-components').default;
const Total = require('./Total');
const Chart = require('./Chart');

class Graphic extends Component {
  constructor({dataURL, scrollyteller}) {
    super();

    this.onMark = this.onMark.bind(this);
    this.updateGroup = this.updateGroup.bind(this);
    this.toggleTransitions = this.toggleTransitions.bind(this);

    this.state = {
      dataById: {},
      groups: [],
      isInteractive: false,
      shouldTransition: true
    };

    csv(dataURL, (err, data) => {
      if (err) {
        throw err;
      }

      this.setState({
        dataById: data.reduce((memo, row) => {
          memo[row.id] = row;

          return memo;
        }, {}),
      });

      document.addEventListener('mark', this.onMark);
      this.onMark({
        detail: scrollyteller.activated ? scrollyteller : {activated: {config: {id: data[0].id}}}
      });
    });
  }

  componentWillUnmount() {
    document.removeEventListener('mark', this.onMark);
  }

  onMark({detail}) {
    if (!detail.activated) {
      return;
    }

    const row =  this.state.dataById[detail.activated.config.id];
    const groups = row ? rowToGroups(row) : this.state.groups;
    const isInteractive = typeof detail.activated.config.interactive === 'boolean' ? 
      detail.activated.config.interactive : false;

    this.setState({
      groups,
      isInteractive
    });
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

  toggleTransitions(shouldTransition) {
    this.setState({shouldTransition});
  }

  render({}, {groups, isInteractive, shouldTransition}) {
    return (
      <Container>
        <Total
          label="of the total votes are ‘Yes’"
          groups={groups}
          reducer={groupsToPct}
          shouldTransition={shouldTransition} />
        <Chart
          groups={groups}
          isInteractive={isInteractive}
          shouldTransition={shouldTransition}
          toggleTransitions={this.toggleTransitions}
          updateGroup={this.updateGroup} />
      </Container>
    );
  }
}

function rowToGroups(row) {
  return [
    {key: 1, name: 'Age 18-34', p: +row.p1, x: +row.x1, y: +row.y1},
    {key: 2, name: 'Age 35-54', p: +row.p2, x: +row.x2, y: +row.y2},
    {key: 3, name: 'Age 55+', p: +row.p3, x: +row.x3, y: +row.y3}
  ];
}

function groupsToPct(groups) {
  return groups.length === 0 ? 0 :
    groups.reduce((memo, group) => memo + (group.p * group.x * group.y), 0) /
    groups.reduce((memo, group) => memo + (group.p * group.y / 100), 0) / 100;
}

module.exports = Graphic;

const Container = styled.div`
  margin: auto;
  padding: 1rem;
  font-family: ${props => props.theme.fontSans};
  font-size: .875rem;
`;
