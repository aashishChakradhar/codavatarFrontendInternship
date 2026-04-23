import { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import DateCalendarServerRequest from "../../components/evenFinder/calendar/calendar";
import { loadEventData } from "../../utils/eventFinder/eventFinder";
import dayjs from "dayjs";
import { EventList } from "../../components/evenFinder/list/eventList";
import { type EventItemProp } from "../../utils/eventFinder/eventFinder";
import EventUpcoming from "../../components/evenFinder/upcoming/eventUpcoming.component";

export default function Index() {
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD"),
  );
  const [data, setData] = useState<EventItemProp[] | null>(null);

  useEffect(() => {
    const available = loadEventData(selectedDate);
    setData(available ?? null);
  }, []);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setData(loadEventData(date) ?? null);
  };

  return (
    <div className="flex flex-col p-5">
      <div className="flex lg:flex-row md:flex-col flex-col justify-center gap-10 items-center">
        <DateCalendarServerRequest onDateSelect={handleDateSelect} />
        <EventList data={data} />
      </div>

      {/* upcomming events */}
      <EventUpcoming />
    </div>
  );
}
