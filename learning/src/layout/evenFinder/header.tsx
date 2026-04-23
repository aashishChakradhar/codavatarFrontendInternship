import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/event-finder/");
  };
  return (
    <div className="text-xl font-bold cursor-pointer" onClick={handleClick}>
      Eventify
    </div>
  );
};
export default Header;
