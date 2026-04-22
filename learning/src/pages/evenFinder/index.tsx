import { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import DateCalendarServerRequest from "../../components/evenFinder/calendar/calendar";
import { loadEventData } from "../../utils/eventFinder/eventFinder";
import dayjs from "dayjs";
import EventCard from "../../components/evenFinder/cards/eventCard";

type EventItem = {
  id: number;
  name: string;
  date: string;
  time: string;
  description: string;
  place: string;
};
export default function Index() {
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD"),
  );
  const [data, setData] = useState<EventItem[] | null>(null);

  useEffect(() => {
    const available = loadEventData(selectedDate);
    setData(available ?? null);
  }, []);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setData(loadEventData(date) ?? null);
  };

  return (
    <div className="flex flex-col flex-wrap box-border">
      <div className="flex flex-row ">
        <div className="flex-1 flex align-middle justify-center">
          <DateCalendarServerRequest onDateSelect={handleDateSelect} />
        </div>

        <div className=" flex flex-col flex-wrap border rounded-lg p-5 w-1/2 box-border ">
          <section className="box-border">
            <h1 className="text-xl font-bold mb-3 text-center">Events</h1>
            {data && data.length > 0 ? (
              <div className="flex flex-wrap flex-col gap-2 box-border ">
                {data.map((evnt, index) => (
                  <div
                    key={index}
                    className="border flex flex-row rounded-md overflow-hidden  mb-3 text-center box-border bg-amber-300 "
                  >
                    <div className=" flex-1 flex flex-col p-2 mr-3">
                      <div className="flex flex-row ">
                        <div className="text-sm font-semibold">{evnt.date}</div>
                        <div className="ml-3 text-sm font-semibold">
                          @{evnt.time}
                        </div>
                        <div className="ml-auto text-sm font-semibold">
                          {evnt.place}
                        </div>
                      </div>
                      <div className="text-lg font-semibold">{evnt.name}</div>
                    </div>
                    <div
                      className="flex p-3 items-center cursor-pointer text-sm font-bold underline"
                      onClick={() => console.log("clicked")}
                    >
                      Learn More {">>"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="font-semibold text-lg bg-amber-300 p-5 border rounded-md">
                Oppss!! No event that day
              </div>
            )}
          </section>
        </div>
      </div>
      <section>
        <h1 className="text-xl font-bold m-10 mb-5">Upcoming Events</h1>
        <div className="flex gap-5">
          {data && data.length > 0 ? (
            data.map((evnt) => (
              <EventCard
                title={evnt.name}
                description={evnt.description}
                // time={evnt.time}
                place={evnt.place}
                date={evnt.date}
                alt="image"
              />
            ))
          ) : (
            <div className="font-semibold text-lg bg-amber-300 p-5 border rounded-md">
              Oppss!! No event that day
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
