const {h, Component} = require('preact');
const styled = require('styled-components').default;
const {css, keyframes} = require('styled-components');
const hint = require('./hint.svg');

class Chart extends Component {
  constructor({groups}) {
    super();
    
    this.state = {
      zOrder: groups.map(group => group.key)
    };

    this.gridRect = null;

    this.onDrag = this.onDrag.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentWillReceiveProps({groups}) {
    this.setState({
      zOrder: groups.map(({key}) => key).sort((a, b) => {
        return this.state.zOrder.indexOf(a) - this.state.zOrder.indexOf(b)
      })
    });
  }

  componentWillUnmount() {
    if (!this.state.dragTargetKey) {
      return;
    }

    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('touchmove', this.onDrag);
    document.removeEventListener('mouseup', this.onDragEnd);
    document.removeEventListener('touchend', this.onDragEnd);
    document.removeEventListener('touchcancel', this.onDragEnd);
  }

  translatePointerToValue(pointer) {
    return {
      x: Math.max(Math.min(pointer.clientX - this.gridRect.left, this.gridRect.width), 0) / this.gridRect.width * 100,
      y: 100 - Math.max(Math.min(pointer.clientY - this.gridRect.top, this.gridRect.height), 0) / this.gridRect.height * 100
    };
  }

  onDragStart(key, event) {
    if (this.state.dragTargetKey) {
      return;
    }

    event.preventDefault();
    event.target.focus();

    const zOrder = [].concat(this.state.zOrder);

    zOrder.splice(zOrder.length - 1, 0, zOrder.splice(zOrder.indexOf(key), 1)[0]);

    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('touchmove', this.onDrag);
    document.addEventListener('mouseup', this.onDragEnd);
    document.addEventListener('touchend', this.onDragEnd);
    document.addEventListener('touchcancel', this.onDragEnd);

    this.gridRect = this.base.querySelector(`.${Grid.styledComponentId}`).getBoundingClientRect();
    
    this.setState({
      dragTargetKey: key,
      zOrder
    });

    this.props.toggleTransitions(false);
  }

  onDrag(event) {
    const {x, y} = this.translatePointerToValue(event.touches ? event.touches[0] : event);

    this.props.updateGroup(this.state.dragTargetKey, x, y);
  }

  onDragEnd(event) {
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('touchmove', this.onDrag);
    document.removeEventListener('mouseup', this.onDragEnd);
    document.removeEventListener('touchend', this.onDragEnd);
    document.removeEventListener('touchcancel', this.onDragEnd);

    this.gridRect = null;

    this.setState({
      dragTargetKey: null
    });

    this.props.toggleTransitions(true);
  }

  render({groups, isInteractive, shouldTransition}, {dragTargetKey}) {
    relaxLabels(groups);

    const minXLabel = Math.min.apply(Math, groups.map(group => group.xLabel));
    const maxXLabel = Math.max.apply(Math, groups.map(group => group.xLabel));
    const minYLabel = Math.min.apply(Math, groups.map(group => group.yLabel));
    const maxYLabel = Math.max.apply(Math, groups.map(group => group.yLabel));

    const midGridines = [
      <Gridline axis="x" style={{left: '50%', height: '100%'}}></Gridline>,
      <Gridline axis="y" style={{bottom: '50%', width: '100%'}}></Gridline>
    ];

    const extentLabels = [
      <Label extent="min" isHidden={minXLabel < 1 || minYLabel < 1}>0%</Label>,
      <Label extent="max" axis="x" isHidden={maxXLabel > 90}>100%</Label>,
      <Label extent="max" axis="y" isHidden={maxYLabel > 94}>100%</Label>
    ];

    const groupGridlines = [];
    const groupLabels = [];
    const groupPoints = [];
    const dragHints = [];
    const legendItems = [];

    this.state.zOrder.forEach(key => {
      groups
      .filter(group => group.key === key)
      .forEach(group => {
        const isInactive = dragTargetKey && group.key !== dragTargetKey;

        groupGridlines.push(
          <Gridline
            key={`group${group.key}XGridline`}
            axis="x"
            groupKey={group.key}
            shouldTransition={shouldTransition}
            isInactive={isInactive}
            style={{left: `${group.x}%`, height: `${group.y}%`}}
          ></Gridline>,
          <Gridline
            key={`group${group.key}YGridline`}
            axis="y"
            groupKey={group.key}
            shouldTransition={shouldTransition}
            isInactive={isInactive}
            style={{bottom: `${group.y}%`, width: `${group.x}%`}}
          ></Gridline>
        );

        groupLabels.push(
          <Label
            key={`group${group.key}XLabel`}
            axis="x"
            groupKey={group.key}
            shouldTransition={shouldTransition}
            isInactive={isInactive}
            style={{left: `${group.xLabel}%`}}
            data-text={`${Math.round(group.x)}%`}
          >{Math.round(group.x)}%</Label>,
          <Label
            key={`group${group.key}YLabel`}
            axis="y"
            groupKey={group.key}
            shouldTransition={shouldTransition}
            isInactive={isInactive}
            style={{bottom: `${group.yLabel}%`}}
            data-text={`${Math.round(group.y)}%`}
          >{Math.round(group.y)}%</Label>
        );

        groupPoints.push(
          <Point
            key={`group${group.key}Point`}
            isInteractive={isInteractive}
            shouldTransition={shouldTransition}
            isInactive={isInactive}
            style={{bottom: `${group.y}%`, left: `${group.x}%`}}
            onMouseDown={isInteractive ? this.onDragStart.bind(this, group.key) : null}
            onTouchStart={isInteractive ? this.onDragStart.bind(this, group.key) : null}
          >
            <Shape groupKey={group.key}></Shape>
          </Point>
        );

        if (typeof dragTargetKey === 'undefined') {
          dragHints.push(
            <DragHint
              shouldTransition={shouldTransition}
              isHidden={!isInteractive}
              style={{bottom: `${group.y}%`, left: `${group.x}%`}}
            ></DragHint>
          );
        }

        legendItems.push(
          <LegendItem groupKey={group.key} isInactive={dragTargetKey && group.key !== dragTargetKey}>
            <Shape groupKey={group.key}></Shape>
            <div>{group.name}</div>
          </LegendItem>
        );
      });
    });

    legendItems.sort((a, b) => a.attributes.groupKey - b.attributes.groupKey);

    return (
      <Container>
        <AxisName axis="x">Percent of voter turnout</AxisName>
        <Grid>
          {midGridines
          .concat(groupGridlines)
          .concat(extentLabels)
          .concat(dragHints)
          .concat(groupPoints)
          .concat(groupLabels)}
        </Grid>
        <AxisName axis="y">Percent of ‘Yes’ votes</AxisName>
        <Legend>
          {legendItems}
        </Legend>
      </Container>
    );
  }
}

module.exports = Chart;

const transitionMixin = css`
  transition:
    opacity .125s ${props => props.theme.bezier},
    transform .5s ${props => props.theme.bezier},
    width .5s ${props => props.theme.bezier},
    height .5s ${props => props.theme.bezier},
    left .5s ${props => props.theme.bezier},
    bottom .5s ${props => props.theme.bezier};
`;

const transitionMixinFn = props =>
  props.shouldTransition ? transitionMixin : `transition: opacity .125s ${props.theme.bezier};`

const Container = styled.div`
  margin-top: 1rem;
  color: ${props => props.theme.text};
  line-height: 1;
  user-select: none;
`;

const AxisName = styled.div`
  font-weight: bold;
  max-width: ${props => props.axis === 'x' ? '6rem' : 'none'};
  text-align: ${props => props.axis === 'x' ? 'left' : 'center'};

  @media (max-height: 30rem) {
    max-width: none;
  }
}
`;

const Grid = styled.div`
  position: relative;
  margin: 1rem 1.125rem 1.625rem 2.125rem;
  border: .125rem solid ${props => props.theme.grey};
  border-top-width: 0;
  border-right-width: 0;
  padding-top: 60%;
  height: 0;
  font-size: .75rem;

  @media (max-height: 30rem) {
    padding-top: 30%;
  }
`;

const Gridline = styled.div`
  opacity: ${props => props.isInactive ? 0 : .3};
  transform: ${props => props.axis === 'x' ? 'translate(-50%, 0)' : 'translate(0, 50%)'};
  position: absolute;
  bottom: ${props => props.axis === 'x' ? '0' : 'auto'};
  left: ${props => props.axis === 'y' ? '0' : 'auto'};
  width: .125rem;
  height: .125rem;
  background: ${props => props.groupKey ? props.theme[`group${props.groupKey}BG`] : props.theme.grey};
  ${transitionMixinFn}
`;

const Label = styled.div`
  opacity: ${props => props.isHidden ? 0 : props.isInactive ? .5 : 1};
  transform: translate(${props => props.axis ==='x' ? '-50%' : '-.375rem'}, ${props => props.axis ==='y' ? '50%' : '.375rem'});
  position: absolute;
  top: ${props => props.axis !== 'y' ? '100%' : 'auto'};
  right: ${props => props.axis !== 'x' ? '100%' : 'auto'};
  bottom: ${props => props.axis === 'y' && props.extent === 'max' ? '100%' : 'auto'};
  left: ${props => props.axis === 'x' && props.extent === 'max' ? '100%' : 'auto'};
  color: ${props => props.groupKey ? props.theme[`group${props.groupKey}FG`] : 'inherit'};
  font-weight: ${props => props.extent ? 'normal' : 'bold'};
  pointer-events: none;
  ${transitionMixinFn}

  @supports (-webkit-text-stroke-width: 0) or (-moz-text-stroke-width: 0) {
    &::before {
      content: attr(data-text);
      position: absolute;
      left: 0;
      z-index: -1;
      -webkit-text-stroke-color: #fff;
      -moz-text-stroke-color: #fff;
      -webkit-text-stroke-width: .125rem;
      -moz-text-stroke-width: .125rem;
    }
  }
`;

const Shape = styled.div`
  transform: ${props => props.groupKey === 2 ? 'rotate(45deg)' : 'none'};
  width: ${props => `${1 + (props.groupKey - 2) * .0625}rem`};
  height: ${props => `${1 + (props.groupKey - 2) * .0625}rem`};
  background-color: ${props => props.groupKey ? props.theme[`group${props.groupKey}BG`] : props.theme.grey};
  border-radius: ${props => props.groupKey === 3 ? '50%' : '.125rem'};
  box-shadow: inset 0 0 0 .0625rem rgba(0, 0, 0, .1);
`;

const Point = styled.div`
  opacity: ${props => props.isInactive ? .5 : 1};
  transform: ${props => `translate(-50%, 50%)${props.isInteractive ? ' scale(2)' : ''}`};
  position: absolute;
  ${transitionMixinFn}
  cursor: ${props => props.isInteractive ? 'pointer' : 'default'};
`;

const dragHintKeyframes = keyframes`
  0%, 100% {
    transform: translate(-50%, 50%) scale(.9);
  }
  50% {
    transform: translate(-50%, 50%) scale(1.1);
  }
`;

const DragHint = styled.div`
  opacity: ${props => props.isHidden ? 0 : 1};
	position: absolute;
	width: 3.75rem;
	height: 3.75rem;
	background-repeat: no-repeat;
	background-size: 100%;
	background-image: url(${hint});
  ${transitionMixinFn}
	animation: 1.25s ${dragHintKeyframes} infinite;
	pointer-events: none;
`;

const Legend = styled.div`
  margin: 1rem 0 0 2.125rem;
`;

const LegendItem = styled.div`
  display: inline-block;
  opacity: ${props => props.isInactive ? .5 : 1};
  color: ${props => props.groupKey ? props.theme[`group${props.groupKey}FG`] : 'inherit'};
  transition: opacity .125s ${props => props.theme.bezier};

  &:not(:first-child) {
    margin-left: .75rem;
  }

  & > * {
    display: inline-block;
    margin-right: ${props => props.groupKey === 2 ? '.325rem' : '.25rem'};
    font-size: .75rem;
    vertical-align: middle;
  }
`;

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
