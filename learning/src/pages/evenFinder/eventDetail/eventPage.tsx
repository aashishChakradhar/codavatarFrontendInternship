import { useNavigate, useParams } from "react-router-dom";
import EventContentContainer from "../../../components/evenFinder/content/eventContent.container";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EventPage() {
  const navigate = useNavigate();
  const param = useParams();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-5 pt-0">
      <button onClick={goBack} className="text-lg cursor-pointer text-blue-500">
        <ArrowBackIcon fontSize="small" />
        Back
      </button>
      <div className="flex flex-col items-center mt-5 mb-10">
        <EventContentContainer id={Number(param.id)} />
      </div>
      <hr />
      <div className="font-semibold text-lg">Comments Section</div>
      <hr />
    </div>
  );
}
