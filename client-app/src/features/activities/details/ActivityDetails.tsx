import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";

interface IDetailsParam {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<IDetailsParam>> = ({
  match,
  history
}) => {
  const { activity, loadActivity, loadingInitial } = useContext(ActivityStore);

  useEffect(() => {
    //Get the id of the selected activity from match.prams.id
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id]);

  if (loadingInitial) {
    return <LoadingComponent content='Loading activity...' />;
  }

  if (!activity) {
    return <h2>Activity Not Found</h2>;
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
