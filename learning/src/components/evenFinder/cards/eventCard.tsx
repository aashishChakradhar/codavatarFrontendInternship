import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import image from "../../../assets/react.svg";
// const image = "../..";

export interface CardProp {
  alt: string;
  title: string;
  description: string;
  date: string;
  place: string;
}

export default function EventCard({
  alt,
  title,
  description,
  date,
  place,
}: CardProp) {
  return (
    <Card
      sx={{
        maxWidth: 345,
        backgroundColor: "transparent",
        border: "2px solid rgba(0,0,0,0.2)",
        borderRadius: "8px",
        boxShadow: " 0px 10px 10px 5px rgba(0, 0, 0, 0.15)",
      }}
      onClick={() => console.log("card clicked")}
    >
      <CardActionArea
        sx={{ width: "250px", height: "400px", overflow: "clip" }}
      >
        <CardMedia
          component="img"
          image={image}
          alt={alt}
          sx={{ height: "150px", objectFit: "contain", padding: "15px" }}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="subtitle1"
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            {title}
            <div className="text-sm font-normal italic">
              {date}: {place}
            </div>
          </Typography>
          <Typography
            gutterBottom
            variant="subtitle2"
            component="div"
            sx={{ fontStyle: "italic" }}
          ></Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
