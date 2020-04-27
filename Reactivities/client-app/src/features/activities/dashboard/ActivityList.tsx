import React, { useContext, Fragment } from 'react';
import { Item, Label, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import { ActivityListItem } from './ActivityListItem';


const ActivityList: React.FC = () => {

  const activityStore = useContext(ActivityStore);
  const {
    activitiesByDate} = activityStore;
    
  return (
    <Fragment>
      {activitiesByDate.map(([group, activities]) => (
        <Fragment key={group}>
           <Label key={group}size='large' color='blue'>
          {group}
        </Label>
        <Segment clearing>
        <Item.Group divided>
          {activities.map(activity => (
           <ActivityListItem key={activity.activityId} activity={activity}/>
          ))}
        </Item.Group>
      </Segment>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
