import PinDropIcon from "@mui/icons-material/PinDrop";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import { type EventItemProp } from "../../../utils/eventFinder/eventFinder";

type EventListProps = {
  data: EventItemProp[] | null;
};

export function EventList({ data }: EventListProps) {
  const navigate = useNavigate();
  const handleClick = (event: EventItemProp) => {
    navigate(`/event-finder/page/${event.id}`, { state: { event } });
  };

  return (
    <div className=" flex flex-col lg:flex-col lg:w-1/2  md:w-3/4  flex-wrap border rounded-lg p-5 box-border max-h-90 overflow-y-auto overflow-x-auto">
      <h1 className="text-xl font-bold mb-3 text-center">Events</h1>
      {data && data.length > 0 ? (
        <div className="flex flex-wrap flex-col gap-2 box-border">
          {data.map((evnt, index) => (
            <div
              key={index}
              className="border flex rounded-md overflow-hidden cursor-pointer p-2 mb-3 text-center box-border bg-amber-100 lg:flex-row md:flex-row flex-col"
              onClick={() => handleClick(evnt)}
            >
              <div className="flex gap-3 lg:flex-row md:flex-row lg:items-center md:items-center items-center">
                <AccessTimeIcon />
                <div className=" text-sm lg:min-w-20 md:min-w-20  font-semibold flex flex-col">
                  <span>{evnt.date}</span>
                  <span>{evnt.time}</span>
                </div>
                <div className="text-lg lg:min-w-50 md:min-w-60 font-semibold">
                  {evnt.name}
                </div>
              </div>

              <div className="flex flex-row ml-0 text-start text-sm items-center font-semibold lg:ml-auto md:ml-auto ">
                <PinDropIcon />
                {evnt.place}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="font-semibold text-lg bg-amber-300 p-5 border rounded-md">
          Oppss!! No event this day
        </div>
      )}
    </div>
  );
}
