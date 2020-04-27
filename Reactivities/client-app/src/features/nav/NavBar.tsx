import React from 'react';
import { Menu, Container, Button} from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';


const NavBar: React.FC = () => {
  //const activityStore = useContext(ActivityStore)
  return (
      <Menu fixed='top' inverted>
        <Container>
          <Menu.Item header as={NavLink} to='/'>
              <img src="/assets/logo.png" alt="logo" style={{marginRight: 10}}/>
              Reactivities
          </Menu.Item>
          <Menu.Item name='Activities' header as={NavLink} to='/activities'/>
          <Menu.Item>
              <Button 
              as={NavLink} to='/createActivity'
              //onClick={activityStore.openCreateForm} 
              positive content='Create Activity' />
          </Menu.Item>
        </Container>
      </Menu>
  );
};

export default observer(NavBar);
