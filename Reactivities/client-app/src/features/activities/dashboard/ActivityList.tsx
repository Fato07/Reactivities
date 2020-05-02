import React, { useContext, Fragment } from 'react';
import { Item, Label, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { ActivityListItem } from './ActivityListItem';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { format } from 'date-fns';


const ActivityList: React.FC = () => {

  const rootStore = useContext(RootStoreContext);
  const { activitiesByDate } = rootStore.activityStore;

  return (
    <Fragment>
      {activitiesByDate.map(([group, activities]) => (
        <Fragment key={group}>
           <Label key={group}size='large' color='blue'>
          {format(group, 'eeee do MMMM')}
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
