import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import uuid from "uuid/v4";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

interface IDetailsParam {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<IDetailsParam>> = ({
  match,
  history
}) => {
  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    description: "",
    category: "",
    date: "",
    city: "",
    venue: ""
  });

  const activityStore = useContext(ActivityStore);

  const {
    createActivity,
    editActivity,
    submitting,
    activity: selectedActivity,
    loadActivity,
    clearActivity
  } = activityStore;

  useEffect(() => {
    if (match.params.id && activity.id.length === 0) {
      loadActivity(match.params.id).then(
        () => selectedActivity && setActivity(selectedActivity)
      );
    }

    return () => {
      clearActivity();
    };
  }, [
    loadActivity,
    clearActivity,
    match.params.id,
    selectedActivity,
    activity.id.length
  ]);

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = () => {
    //[1,2,3,4,5,6]

    if (activity.id.length === 0) {
      //create a new activity
      let newActivity: IActivity = { ...activity, id: uuid() };
      createActivity(newActivity).then(() =>
        history.push(`/activities/${newActivity.id}`)
      );
    } else {
      //edit an existing activity
      editActivity(activity).then(() =>
        history.push(`/activities/${activity.id}`)
      );
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <Form onSubmit={handleSubmit}>
            <Form.Input
              placeholder="Title"
              value={activity.title}
              name="title"
              onChange={handleInputChange}
            />
            <Form.TextArea
              rows={2}
              placeholder="Description"
              value={activity.description}
              name="description"
              onChange={handleInputChange}
            />
            <Form.Input
              placeholder="Category"
              value={activity.category}
              name="category"
              onChange={handleInputChange}
            />
            <Form.Input
              type="datetime-local"
              placeholder="Date"
              value={activity.date}
              name="date"
              onChange={handleInputChange}
            />
            <Form.Input
              placeholder="City"
              value={activity.city}
              name="city"
              onChange={handleInputChange}
            />
            <Form.Input
              placeholder="Venue"
              value={activity.venue}
              name="venue"
              onChange={handleInputChange}
            />
            <Button
              loading={submitting}
              floated="right"
              positive
              content="Submit"
              type="submit"
            />
            <Button
              floated="right"
              content="Cancel"
              onClick={() => history.push("/activities")}
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
