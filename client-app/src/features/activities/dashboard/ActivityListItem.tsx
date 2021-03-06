import React from 'react';
import { Item, Button, Segment, Icon } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size="tiny" circular src="/assets/user.png" />
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Description>Hosted By Bob</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>

      <Segment>
        <Icon name="clock" />
        {format(activity.date, 'h:mm a')}
        <Icon name="marker" />
        {activity.city}
      </Segment>

      <Segment secondary>Attendees will go here</Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          color="blue"
          floated="right"
          content="View"
          as={Link}
          to={`/activities/${activity.id}`}
        />
      </Segment>
    </Segment.Group>
  );
};

export default ActivityListItem;
