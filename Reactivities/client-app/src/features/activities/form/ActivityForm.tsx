import React from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'

interface IProps {
    activity: IActivity;
}

export const ActivityForm: React.FC<IProps> = ({activity}) => {
    return (
     <Segment clearing>
      <Form >
        <Form.Input
          //nChange={handleInputChange}
          name='title'
          placeholder='Title'
          value={activity.title}
        />
        <Form.TextArea
          //onChange={handleInputChange}
          name='description'
          rows={2}
          placeholder='Description'
          value={activity.description}
        />
        <Form.Input
          //onChange={handleInputChange}
          name='category'
          placeholder='Category'
          value={activity.category}
        />
        <Form.Input
          //onChange={handleInputChange}
          name='date'
          type='datetime-local'
          placeholder='Date'
          value={activity.date}
        />
        <Form.Input
          name='city'
          placeholder='City'
          value={activity.city}
        />
        <Form.Input
          name='venue'
          placeholder='Venue'
          value={activity.venue}
        />
        <Button floated='right' positive type='submit' content='Submit' />
        <Button
          //onClick={() => setEditMode(false)}
          floated='right'
          type='button'
          content='Cancel'
        />
      </Form>
    </Segment>
      
    )
}
