import { Request, Response } from "express";

class ListController {
    getListPage(request: Request, response: Response) {
        response.type('text/html');
        response.render('list', { title: '影片列表' });
    }
}

export default ListController;
