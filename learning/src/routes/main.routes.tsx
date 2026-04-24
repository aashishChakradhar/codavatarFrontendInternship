import { createBrowserRouter } from "react-router-dom";
import { allRoutes } from "./allroute";
import { eventFinderRoutes } from "./evenFinder/eFinderRoutes";
import { pokemonRoutes } from "./pokemon/pokemonRoutes";

const mainRouter = createBrowserRouter([
  ...allRoutes,
  ...eventFinderRoutes,
  ...pokemonRoutes,
]);

export default mainRouter;
