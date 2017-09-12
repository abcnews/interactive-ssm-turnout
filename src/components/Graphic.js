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
    this.dataById[this.state.id][`x${key}`] = x;
    this.dataById[this.state.id][`y${key}`] = y;
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
    {key: 1, name: 'Age 18-34', p: +row.p1, u: +row.u1, x: +row.x1, y: +row.y1},
    {key: 2, name: 'Age 35-54', p: +row.p2, u: +row.u2, x: +row.x2, y: +row.y2},
    {key: 3, name: 'Age  55+', p: +row.p3, u: +row.u3, x: +row.x3, y: +row.y3}
  ];
}

function groupsToPct(isKnown, groups) {
  return groups.length === 0 ? 0 :
    groups.reduce((memo, group) => memo + group.p * group.x * group.y, 0) /
    groups.reduce((memo, group) => memo + group.p * group.y, 0);
}

function groupsToPct(isKnown, groups) {
  return groups.length === 0 ? 0 :
    groups.reduce((memo, group) => memo + group.p * (1 - (isKnown ? group.u : 0)) * group.y * group.x / (1 - (isKnown ? group.u : 0)), 0) /
    groups.reduce((memo, group) => memo + group.p * (1 - (isKnown ? group.u : 0)) * group.y, 0);
}

module.exports = Graphic;

const Container = styled.div`
  margin: auto;
  padding: 1rem;
  font-family: ${props => props.theme.fontSans};
  font-size: .875rem;
`;
