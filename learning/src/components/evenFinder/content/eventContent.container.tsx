import PlaceIcon from "@mui/icons-material/Place";
import image from "../../../assets/react.svg";
import {
  type EventItemProp,
  findEvent,
} from "../../../utils/eventFinder/eventFinder";
import { useState, useEffect } from "react";

export default function EventContentContainer({ id }: { id: number }) {
  const [data, setData] = useState<EventItemProp>();
  useEffect(() => {
    setData(findEvent(Number(id)));
  }, []);
  console.log("from page", data);
  if (!data) {
    return <div>Event not found</div>;
  }
  //   return <EventContentComponent {...data} />;
  return (
    <div className="flex flex-col box-border flex-wrap border rounded-md p-5 h-150 pt-4 w-full overflow-clip md:w-3/5 ">
      <div className="flex flex-row">
        <div>
          <div className="text-lg font-semibold">{data.name}</div>
          <div className="text-sm font-normal italic flex items-center">
            <PlaceIcon />
            {data.place}
          </div>
        </div>
        <div className="ml-auto italic text-xs font-semibold">
          <div>{data.date}</div>
          <div>{data.time}</div>
        </div>
      </div>

      <img
        src={image}
        alt="image"
        className="h-40 border p-6 box-border object-contain mb-3 mt-2"
      />

      <div className=" flex-1 eventListScroll mt-2 text-pretty overflow-y-auto">
        {data.description}
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod blanditiis
        non fugit tempore doloribus rem, vitae voluptate quasi perferendis velit
        debitis corporis quisquam. Dolorum cupiditate nesciunt, deleniti tenetur
        laboriosam voluptate?
        <br />
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed,
        asperiores? Error enim quo officiis commodi exercitationem quisquam
        tenetur labore laborum facere quasi, atque hic reprehenderit quia maxime
        odio veniam voluptatum.
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
        quisquam odit tempore eveniet recusandae aut consequatur dolores quos
        expedita blanditiis nihil nulla labore maxime dignissimos ipsam,
        accusantium autem impedit! Pariatur.
      </div>
    </div>
  );
}
