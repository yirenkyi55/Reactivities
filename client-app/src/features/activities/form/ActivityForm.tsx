import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { ActivityFormValues } from '../../../app/models/activity';
import uuid from 'uuid/v4';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/options/categoryOptions';
import DateInput from '../../../app/common/form/DateInput';
import { combineDateAndTime } from '../../../app/common/utils/util';
import {
  combineValidators,
  isRequired,
  composeValidators,
  hasLengthGreaterThan
} from 'revalidate';

const validate = combineValidators({
  title: isRequired({ message: 'The event title is required' }),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({
      message: 'Description needs to be at least 5 characters'
    })
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time')
});

interface IDetailsParam {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<IDetailsParam>> = ({
  match,
  history
}) => {
  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);

  const activityStore = useContext(ActivityStore);

  const {
    createActivity,
    editActivity,
    submitting,
    loadActivity
  } = activityStore;

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then(activity => setActivity(new ActivityFormValues(activity)))
        .finally(() => setLoading(false));
    }
  }, [loadActivity, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;
    if (!activity.id) {
      //create a new activity
      let newActivity = { ...activity, id: uuid() };
      createActivity(newActivity);
    } else {
      //edit an existing activity
      editActivity(activity);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  placeholder="Title"
                  value={activity.title}
                  name="title"
                  component={TextInput}
                />
                <Field
                  rows={3}
                  placeholder="Description"
                  value={activity.description}
                  name="description"
                  component={TextAreaInput}
                />
                <Field
                  placeholder="Category"
                  value={activity.category}
                  name="category"
                  component={SelectInput}
                  options={category}
                />
                <Form.Group widths="equal">
                  <Field
                    placeholder="Date"
                    value={activity.date}
                    name="date"
                    date={true}
                    component={DateInput}
                  />
                  <Field
                    placeholder="Time"
                    value={activity.date}
                    name="time"
                    time={true}
                    component={DateInput}
                  />
                </Form.Group>

                <Field
                  placeholder="City"
                  value={activity.city}
                  name="city"
                  component={TextInput}
                />
                <Field
                  placeholder="Venue"
                  value={activity.venue}
                  name="venue"
                  component={TextInput}
                />
                <Button
                  disabled={loading || invalid || pristine}
                  loading={submitting}
                  floated="right"
                  positive
                  content="Submit"
                  type="submit"
                />
                <Button
                  disabled={loading}
                  floated="right"
                  content="Cancel"
                  onClick={() =>
                    activity.id
                      ? history.push(`/activities/${activity.id}`)
                      : history.push('/activities')
                  }
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
