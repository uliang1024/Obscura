import RecordController from "../../controllers/RecordController";
import Route from "../route";

class RecordRoute extends Route {
    private recordController = new RecordController();

    constructor() {
        super();
        this.prefix = '/video';
        this.setRoutes();
    }

    protected setRoutes() {
        this.router.get('/record', this.recordController.getRecordPage);
    }
}

export default RecordRoute;