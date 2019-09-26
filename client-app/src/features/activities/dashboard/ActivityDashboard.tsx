import React, { useContext } from "react";
import { Grid } from "semantic-ui-react";

import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";

const ActivityDashboard: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const { editMode, selectedActivity } = activityStore;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>

      <Grid.Column width={6}>
        {// If we are not in editMode and activity is selected then show the details component
        selectedActivity && !editMode && <ActivityDetails />}
        {// If we are in edit mode then show the activity form..
        //Give the activity form a key so that when the key changes we can re-render it..
        editMode && <ActivityForm />}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
