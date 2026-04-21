import { createBrowserRouter } from "react-router-dom";
import { allRoutes } from "./allroute";
import { eventFinderRoutes } from "./evenFinder/eFinderRoutes";

const mainRouter = createBrowserRouter([...allRoutes, ...eventFinderRoutes]);

export default mainRouter;
