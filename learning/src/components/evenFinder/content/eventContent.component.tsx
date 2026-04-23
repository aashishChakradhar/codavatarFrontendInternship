import { type EventItemProp } from "../../../utils/eventFinder/eventFinder";

export function EventContentComponent(props: EventItemProp) {
  return (
    <div>
      <div>{props.name}</div>
      <div>{props.place}</div>
      <div>{props.time}</div>
      <div>{props.date}</div>
      <div>{props.description}</div>
    </div>
  );
}
