const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function setDate() {
  document.querySelector("#day").innerHTML = days[new Date().getDay()];
  document.querySelector("#date").innerHTML = new Date().toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
  );
}
setDate();

setInterval(() => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  document.querySelector("#time").innerHTML = `${hours}:${minutes}:${seconds}`;
}, 1000);
