import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { RouteComponentProps } from "react-router-dom";
import LoadingComponenet from "../../../app/layout/LoadingComponenet";
import { observer } from "mobx-react-lite";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";

interface RouteParams {
  userName: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const ProfilePage: React.FC<IProps> = ({ match }) => {
  const rootStore = useContext(RootStoreContext);
  const { loadingProfile, profile, loadProfile } = rootStore.profileStore;

  useEffect(() => {
    loadProfile(match.params.userName);
  }, [match, loadProfile]);

  if(loadingProfile) return <LoadingComponenet content='Loading Profile...' />

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader profile={profile!} />
        <ProfileContent />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfilePage);
