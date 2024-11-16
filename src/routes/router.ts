import Route from "./route";
import HomeRoute from "./pages/home.route";
import RecordRoute from "./pages/record.route";
import ListRoute from "./pages/list.route";

export const router: Array<Route> = [
    new HomeRoute(),
    new RecordRoute(),
    new ListRoute()
]