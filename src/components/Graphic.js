const {csv} = require('d3-request');
const {h, Component} = require('preact');
const styled = require('styled-components').default;
const Total = require('./Total');
const Chart = require('./Chart');

class Graphic extends Component {
  constructor({dataURL, scrollyteller}) {
    super();

    this.onMark = this.onMark.bind(this);
    this.editGroup = this.editGroup.bind(this);
    this.toggleTransitions = this.toggleTransitions.bind(this);

    this.dataById = {};

    this.state = {
      id: null,
      groups: [],
      isKnown: false,
      isEditable: false,
      shouldTransition: true
    };

    csv(dataURL, (err, data) => {
      if (err) {
        throw err;
      }

      this.dataById = data.reduce((memo, row) => {
        memo[row.id] = row;

        return memo;
      }, {});

      document.addEventListener('mark', this.onMark);

      if (scrollyteller.activated) {
        this.onMark({detail: scrollyteller});
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener('mark', this.onMark);
  }

  onMark({detail}) {
    if (!detail.activated) {
      return;
    }

    const id = detail.activated.config.id;
    const isKnown = typeof detail.activated.config.known === 'boolean' ? 
      detail.activated.config.known : false;
    const isEditable = typeof detail.activated.config.editable === 'boolean' ? 
      detail.activated.config.editable : false;

    this.loadRow(id, isKnown, isEditable);
  }

  loadRow(id, isKnown, isEditable) {
    const groups = this.dataById[id] ? rowToGroups(this.dataById[id]) : this.state.groups;

    this.setState({
      id,
      groups,
      isKnown,
      isEditable
    });
  }

  editGroup(key, x, y) {
    const row = this.dataById[this.state.id];
    
    // row[`xk${key}`] = row[`xk${key}`] / (row[`pk${key}`]) x;
    row[`xk${key}`] = x;
    row[`x${key}`] = x;
    row[`y${key}`] = y;

    this.loadRow(this.state.id, this.state.isKnown, this.state.isEditable);
  }

  toggleTransitions(shouldTransition) {
    this.setState({shouldTransition});
  }

  render({}, {groups, isKnown, isEditable, shouldTransition}) {
    return (
      <Container>
        <Total
          label={`of ${isKnown ? 'declared' : 'the total'} votes are ‘Yes’`}
          groups={groups}
          reducer={groupsToPct.bind(this, isKnown)}
          shouldTransition={shouldTransition} />
        <Chart
          groups={groups}
          isEditable={isEditable}
          shouldTransition={shouldTransition}
          toggleTransitions={this.toggleTransitions}
          editGroup={this.editGroup} />
      </Container>
    );
  }
}

function rowToGroups(row) {
  return [
    {key: 1, name: 'Age 18-34', p: +row.p1, pk: +row.pk1, x: +row.x1, xk: +row.xk1, y: +row.y1},
    {key: 2, name: 'Age 35-54', p: +row.p2, pk: +row.pk2, x: +row.x2, xk: +row.xk2, y: +row.y2},
    {key: 3, name: 'Age  55+', p: +row.p3, pk: +row.pk3, x: +row.x3, xk: +row.xk3, y: +row.y3}
  ];
}

function groupsToPct(isKnown, groups) {
  return groups.length === 0 ? 0 :
    groups.reduce((memo, group) => memo + (group[isKnown ? 'pk' : 'p'] * group[isKnown ? 'xk' : 'x'] * group.y), 0) /
    groups.reduce((memo, group) => memo + (group[isKnown ? 'pk' : 'p'] * group.y / 100), 0) / 100;
}

module.exports = Graphic;

const Container = styled.div`
  margin: auto;
  padding: 1rem;
  font-family: ${props => props.theme.fontSans};
  font-size: .875rem;
`;
