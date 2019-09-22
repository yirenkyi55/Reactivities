import React from "react";
import { Item, Button, Label, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";

interface IProps {
  activities: IActivity[];
  selectActivity: (id: String) => void;
  setEditMode: (editMode: Boolean) => void;
  deleteActivity: (id: String) => void;
}

const ActivityList: React.FC<IProps> = ({
  activities,
  selectActivity,
  setEditMode,
  deleteActivity
}) => {
  return (
    <Segment clearing>
      <Item.Group divided>
        {activities.map(activity => (
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
                    setEditMode(false);
                  }}
                />
                <Button
                  color="red"
                  floated="right"
                  content="Delete"
                  onClick={() => deleteActivity(activity.id)}
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

export default ActivityList;
