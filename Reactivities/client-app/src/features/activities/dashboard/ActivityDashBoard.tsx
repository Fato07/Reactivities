import React, { useContext, useEffect, useState } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponenet';
import { RootStoreContext } from '../../../app/stores/rootStore';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityFilters from './ActivityFilter';

const ActivityDashboard: React.FC = () => {

  const rootStore = useContext(RootStoreContext);
  const {loadActivities, loadingInitial, setPage, page, totalPages} = rootStore.activityStore;
  //local states to track the next batch of activities
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page + 1);
    loadActivities().then(() => setLoadingNext(false));
  }

  // LoadActivites from Db when this Componenet is mounted
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  if (loadingInitial && page === 0)
    return <LoadingComponent content='Loading activities' />;

  //hasMore: Check that the next batch of activities is not being loaded.
  //initialLoad: set to false beacause useEffect hook would be responsible for loadiing Initial Batch of activities
  return (
    <Grid>
      <Grid.Column width={10}>
        <InfiniteScroll 
        pageStart={0} 
        loadMore={handleGetNext} 
        hasMore={!loadingNext && page + 1 < totalPages}
        initialLoad={false} > 
        
        <ActivityList />
        </InfiniteScroll>
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityFilters/>
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
