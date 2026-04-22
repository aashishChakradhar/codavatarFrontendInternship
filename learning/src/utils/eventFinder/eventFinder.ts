import type { Dayjs } from "dayjs";
import data from "../../data/eventFinder/events.json";

type EventItem = {
  id: number;
  name: string;
  date: string;
  time: string;
  description: string;
  place: string;
};

function loadData(): EventItem[] {
  //checks if data is array
  //keep it in EventItem structure
  const eventList = Array.isArray(data) ? (data as EventItem[]) : [];
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

export function loadEventData(date: string): EventItem[] | undefined {
  const eventList = loadData();
  //   search data based on date
  //returns object
  const available = eventList.filter((event) => event.date === date);
  return available;
}
