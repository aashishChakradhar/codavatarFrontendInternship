import type { Dayjs } from "dayjs";
import data from "../../data/eventFinder/events.json";
import dayjs from "dayjs";

export interface EventItemProp {
  id: number;
  name: string;
  date: string;
  time: string;
  description: string;
  place: string;
}

function loadData(): EventItemProp[] {
  //checks if data is array
  //keep it in EventItemProp structure
  const eventList = Array.isArray(data) ? (data as EventItemProp[]) : [];
  return eventList.toSorted((first, second) =>
    first.date.localeCompare(second.date),
  );
}

export function loadEventDates(date: Dayjs): string[] {
  const converted = date.format("YYYY-MM");
  const eventList = loadData();
  const dateList = eventList.filter(
    (event) => event.date.slice(0, 7) === converted,
  );
  const dates = dateList.map((dl) => dl.date.slice(8, 10));
  return dates;
}

export function findEvent(id: number): EventItemProp | undefined {
  const eventList = loadData();
  const event = eventList.find((evnt) => evnt.id === id);
  console.log(event);
  return event;
}

export function loadEventData(date: string): EventItemProp[] | undefined {
  const eventList = loadData();
  //   search data based on date
  //returns object
  const available = eventList.filter((event) => event.date === date);
  return available;
}

export function findUpcomingEvents(): EventItemProp[] {
  const loadedData = loadData();
  const date = dayjs().format("YYYY-MM-DD");
  const upcoming = loadedData.filter((load) => load.date >= date);
  return upcoming.slice(0, 5);
}
