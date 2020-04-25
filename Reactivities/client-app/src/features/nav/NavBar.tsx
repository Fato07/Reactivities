import React from 'react';
import { Menu, Container, Button, Segment } from 'semantic-ui-react';

interface IProps {
  openCreateForm: () => void;
}

const NavBar = () => {
  return (
    <Segment inverted>
    <Menu inverted pointing secondary>
      <Menu.Item
        name='home'
        
      />
      <Menu.Item
        name='messages'
       
      />
      <Menu.Item
        name='friends'
        
      />
    </Menu>
  </Segment>
  );
};

export default NavBar;
