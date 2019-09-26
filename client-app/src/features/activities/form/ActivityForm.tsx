import React, { useState, FormEvent, useContext } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import uuid from "uuid/v4";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";

const ActivityForm: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    submitting,
    selectedActivity,
    cancelFormOpen
  } = activityStore;

  const initializeForm = () => {
    if (selectedActivity) {
      return selectedActivity;
    } else {
      return {
        id: "",
        title: "",
        description: "",
        category: "",
        date: "",
        city: "",
        venue: ""
      };
    }
  };

  const [activity, setActivity] = useState<IActivity>(initializeForm);
  const [inputChange, setInputChange] = useState(false);

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
    setInputChange(true);
  };

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      console.log(activity);
      //create a new activity
      let newActivity = { ...activity, id: uuid() };
      createActivity(newActivity);
    } else {
      if (!inputChange) {
        let oactivity: IActivity = { ...activity };
        //edit an existing activity
        console.log(oactivity);
        editActivity(oactivity);
      } else {
        //edit an existing activity
        editActivity(activity);
      }
    }
  };

  return (
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
          onClick={() => cancelFormOpen}
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
