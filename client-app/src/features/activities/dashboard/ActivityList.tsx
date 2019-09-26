import React, { useContext } from "react";
import { Item, Button, Label, Segment } from "semantic-ui-react";

import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";

const ActivityList: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const {
    activitiesByDate,
    selectActivity,
    deleteActivity,
    submitting,
    target
  } = activityStore;

  return (
    <Segment clearing>
      <Item.Group divided>
        {activitiesByDate.map(activity => (
          <Item key={activity.id as string}>
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>
                  {activity.city}, {activity.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  color="blue"
                  floated="right"
                  content="View"
                  onClick={() => {
                    selectActivity(activity.id);
                  }}
                />
                <Button
                  name={activity.id}
                  loading={target === activity.id && submitting}
                  color="red"
                  floated="right"
                  content="Delete"
                  onClick={e => deleteActivity(e, activity.id)}
                />
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};

export default observer(ActivityList);
