import HomeController from "../../controllers/HomeController"
import Route from "../route";

class HomeRoute extends Route {
    private homeController = new HomeController();

    constructor() {
        super();
        this.setRoutes();
    }

    protected setRoutes() {
        this.router.get('/', this.homeController.echo);
    }
}

export default HomeRoute;
