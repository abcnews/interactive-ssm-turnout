const {h, Component} = require('preact');
const styled = require('styled-components').default;
const Total = require('./Total');
const Chart = require('./Chart');

class Graphic extends Component {
  constructor({data, scrollyteller}) {
    super();

    this.onMark = this.onMark.bind(this);
    this.editGroup = this.editGroup.bind(this);
    this.toggleTransitions = this.toggleTransitions.bind(this);

    this.data = data;

    this.state = {
      id: null,
      groups: [],
      isEditable: false,
      shouldTransition: true
    };

    if (scrollyteller.activated) {
      this.onMark({detail: scrollyteller});
    }

    document.addEventListener('mark', this.onMark);
  }

  componentWillUnmount() {
    document.removeEventListener('mark', this.onMark);
  }

  onMark({detail}) {
    if (!detail.activated) {
      return;
    }

    const id = detail.activated.config.id;
    const isEditable = typeof detail.activated.config.editable === 'boolean' ? 
      detail.activated.config.editable : false;

    this.loadRow(id, isEditable);
  }

  loadRow(id, isEditable) {
    const groups = this.data[id] ? rowToGroups(this.data[id]) : this.state.groups;

    this.setState({
      id,
      groups,
      isEditable
    });
  }

  editGroup(key, x, y) {   
    this.data[this.state.id][`x${key}`] = x;
    this.data[this.state.id][`y${key}`] = y;
    this.loadRow(this.state.id, this.state.isEditable);
  }

  toggleTransitions(shouldTransition) {
    this.setState({shouldTransition});
  }

  render({}, {groups, isEditable, shouldTransition}) {
    return (
      <Container>
        <Total
          label={`of the response is ‘Yes’`}
          groups={groups}
          reducer={groupsToPct}
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

function groupsToPct(groups) {
  return groups.length === 0 ? 0 :
    groups.reduce((memo, group) => memo + group.p * (1 - group.u) * group.y * group.x / (1 - group.u), 0) /
    groups.reduce((memo, group) => memo + group.p * (1 - group.u) * group.y, 0);
}

module.exports = Graphic;

const Container = styled.div`
  margin: auto;
  padding: 1rem;
  font-family: ${props => props.theme.fontSans};
  font-size: .875rem;
`;
