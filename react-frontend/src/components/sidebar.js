import React from 'react'
import {
  Button,
  Checkbox,
  Grid,
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar,
} from 'semantic-ui-react'

const VerticalSidebar = ({ animation, direction, visible }) => (
    <Sidebar
      as={Menu}
      animation={animation}
      direction={direction}
      icon='labeled'
      inverted
      vertical
      visible={visible}
      width='thin'
    >
      <Menu.Item as='a'>
        <Icon name='home' />
        Home
      </Menu.Item>
      <Menu.Item as='a'>
        <Icon name='gamepad' />
        Games
      </Menu.Item>
      <Menu.Item as='a'>
        <Icon name='camera' />
        Channels
      </Menu.Item>
    </Sidebar>
  )

  function exampleReducer(state, action) {
    switch (action.type) {
      case 'CHANGE_ANIMATION':
        return { ...state, animation: action.animation, visible: !state.visible }
      case 'CHANGE_DIMMED':
        return { ...state, dimmed: action.dimmed }
      case 'CHANGE_DIRECTION':
        return { ...state, direction: action.direction, visible: false }
      default:
        throw new Error()
    }
  }

  function SidebarExampleTransitions() {
    const [state, dispatch] = React.useReducer(exampleReducer, {
      animation: 'scale down',
      direction: 'right',
      dimmed: false,
      visible: true,
    })
  
    const { animation, dimmed, direction, visible } = state
    const vertical = direction === 'bottom' || direction === 'top';

    return (
        <div>
            <Button
        onClick={() =>
          dispatch({ type: 'CHANGE_ANIMATION', animation: 'push' })
        }
      >
        Push
      </Button>

