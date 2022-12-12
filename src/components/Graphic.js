import Scrollyteller from '@abcnews/scrollyteller';
import React from 'react';
import styled from 'styled-components';
import Total from './Total';
import Chart from './Chart';

const Container = styled.div`
  margin: auto;
  padding: 1rem;
  font-family: ${(props) => props.theme.fontSans};
  font-size: 0.875rem;
`;

class Graphic extends React.Component {
  constructor({ data, scrollyData }) {
    super();

    this.data = data;
    this.scrollyData = scrollyData;

    this.onMarker = this.onMarker.bind(this);
    this.editGroup = this.editGroup.bind(this);
    this.toggleTransitions = this.toggleTransitions.bind(this);

    this.state = {
      id: null,
      groups: [],
      isDemo: false,
      isEditable: false,
      shouldTransition: true,
    };
  }

  onMarker(config) {
    const isDemo = typeof config.demo === 'boolean' ? config.demo : false;

    if (isDemo) {
      const u = String(config.u || 0);
      const x = String(config.x || 0);
      const y = String(config.y || 0);

      return this.loadDemo(
        parseFloat(u.replace('p', '.'), 10) / 100,
        parseFloat(x.replace('p', '.'), 10) / 100,
        parseFloat(y.replace('p', '.'), 10) / 100
      );
    }

    const id = config.id;
    const isEditable =
      typeof config.editable === 'boolean' ? config.editable : false;

    this.loadRow(id, isEditable);
  }

  loadDemo(u, x, y) {
    this.setState({
      id: null,
      groups: demoToGroups(u, x, y),
      isDemo: true,
      isEditable: false,
    });
  }

  loadRow(id, isEditable) {
    const groups = this.data[id]
      ? rowToGroups(this.data[id])
      : this.state.groups;

    this.setState({
      id,
      groups,
      isDemo: false,
      isEditable,
    });
  }

  editGroup(key, x, y) {
    this.data[this.state.id][`x${key}`] = x;
    this.data[this.state.id][`y${key}`] = y;
    this.loadRow(this.state.id, this.state.isEditable);
  }

  toggleTransitions(shouldTransition) {
    this.setState({ shouldTransition });
  }

  render() {
    const { groups, isDemo, isEditable, shouldTransition } = this.state;

    return (
      <Scrollyteller panels={this.scrollyData.panels} onMarker={this.onMarker}>
        <Container>
          <Total
            label={`of the response is ‘Yes’`}
            groups={groups}
            reducer={groupsToPct}
            shouldTransition={shouldTransition}
          />
          <Chart
            groups={groups.map(({ x, y, u, key, name }) => ({
              x: x / (1 - u),
              y,
              key,
              name,
            }))}
            isDemo={isDemo}
            isEditable={isEditable}
            shouldTransition={shouldTransition}
            toggleTransitions={this.toggleTransitions}
            editGroup={this.editGroup}
          />
        </Container>
      </Scrollyteller>
    );
  }
}

export default Graphic;

function demoToGroups(u, x, y) {
  return rowToGroups({
    p1: 1,
    p2: 1,
    p3: 1,
    u1: u,
    u2: u,
    u3: u,
    x1: x,
    x2: x,
    x3: x,
    y1: y,
    y2: y,
    y3: y,
  }).concat([{ key: 4, name: 'All voters', p: 1, u: u, x, y }]);
}

function rowToGroups(row) {
  return [
    {
      key: 1,
      name: 'Age 18-34',
      p: +row.p1,
      u: +row.u1,
      x: +row.x1,
      y: +row.y1,
    },
    {
      key: 2,
      name: 'Age 35-54',
      p: +row.p2,
      u: +row.u2,
      x: +row.x2,
      y: +row.y2,
    },
    {
      key: 3,
      name: 'Age  55+',
      p: +row.p3,
      u: +row.u3,
      x: +row.x3,
      y: +row.y3,
    },
  ];
}

function groupsToPct(groups) {
  return groups.length === 0
    ? 0
    : groups.reduce(
        (memo, group) =>
          memo + (group.p * (1 - group.u) * group.y * group.x) / (1 - group.u),
        0
      ) /
        groups.reduce(
          (memo, group) => memo + group.p * (1 - group.u) * group.y,
          0
        );
}
