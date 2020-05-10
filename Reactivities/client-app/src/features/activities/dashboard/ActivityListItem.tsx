import React from "react";
import { Item, Button, Segment, Icon, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { IActivity } from "../../../app/models/activity";
import { format } from "date-fns";
import ActivityListItemAttendees from "./ActivityListItemAttendees";

export const ActivityListItem: React.FC<{ activity: IActivity }> = ({
  activity,
}) => {
  //access to host
  const host = activity.userActivities.filter((x) => x.isHost)[0];
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image
              size="tiny"
              circular
              src={host.image || "/assets/user.png"}
              style={{ marginBottom: 3 }}
            />
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.activityId}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>
                Hosted by
                <Link to={`/profile/${host.username}`}> {host.displayName}</Link>
              </Item.Description>
              {activity.isHost && (
                <Item.Description>
                  <Label
                    basic
                    color="orange"
                    content="You are Hosting this Activity"
                  />
                </Item.Description>
              )}
              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label
                    basic
                    color="green"
                    content="You are Going to this Activity"
                  />
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" /> {format(activity.date, "h:mm a")}
        <Icon name="marker" /> {activity.venue}, {activity.city}
      </Segment> 
      {/* userActivity is the same as attendee to an event, Using it this way because i could not find a hack to rename my API property to "Attendee"*/}
      <Segment secondary>
        <ActivityListItemAttendees attendees={activity.userActivities} />{" "}
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.activityId}`}
          floated="right"
          content="View"
          color="blue"
        />
      </Segment>
    </Segment.Group>
  );
};

export default ActivityListItem;
