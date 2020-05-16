import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import ProfileHeader from './ProfileHeader';
import ProfileContent from './ProfileContent';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import LoadingComponenet from '../../app/layout/LoadingComponenet';

interface RouteParams {
  username: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const ProfilePage: React.FC<IProps> = ({ match }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingProfile,
    profile,
    loadProfile,
    follow,
    unfollow,
    isCurrentUser,
    loading,
   // setActiveTab
  } = rootStore.profileStore;

  console.log("test " + match.params.username)
  useEffect(() => {
    loadProfile(match.params.username);
  }, [loadProfile, match]);

  if (loadingProfile) return <LoadingComponenet content='Loading profile...' />;

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader
          profile={profile!}
          isCurrentUser={isCurrentUser}
          loading={loading}
          follow={follow}
          unfollow={unfollow}
        />
        <ProfileContent />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfilePage);
