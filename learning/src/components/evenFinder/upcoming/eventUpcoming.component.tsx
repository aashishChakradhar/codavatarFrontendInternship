import {
  findUpcomingEvents,
  type EventItemProp,
} from "../../../utils/eventFinder/eventFinder";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import EventCard from "../cards/eventCard";
export default function EventUpcoming() {
  const [data, setData] = useState<EventItemProp[]>();
  useEffect(() => {
    setData(findUpcomingEvents());
  }, []);
  const navigate = useNavigate();
  const handleClick = (event: EventItemProp) => {
    navigate(`/event-finder/page/${event.id}`, { state: { event } });
  };
  return (
    <div className="flex flex-col gap-5 box-border mt-5">
      <h1 className="text-xl font-bold ml-10 ">Upcoming Events</h1>
      <div className="flex gap-5 px-10 pb-5 box-border flex-wrap justify-center ">
        {data && data.length > 0 ? (
          data.map((evnt) => (
            <div key={evnt.id} onClick={() => handleClick(evnt)}>
              <EventCard
                title={evnt.name}
                description={evnt.description}
                // time={evnt.time}
                place={evnt.place}
                date={evnt.date}
                alt="image"
              />
            </div>
          ))
        ) : (
          <div className="font-semibold text-lg bg-amber-300 p-5 border rounded-md">
            Oppss!! No event that day
          </div>
        )}
      </div>
    </div>
  );
}
