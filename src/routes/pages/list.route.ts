import ListController from "../../controllers/ListController";
import Route from "../route";

class ListRoute extends Route {
    private listController = new ListController();

    constructor() {
        super();
        this.prefix = '/video';
        this.setRoutes();
    }

    protected setRoutes() {
        this.router.get('/list', this.listController.getListPage);
    }
}

export default ListRoute;