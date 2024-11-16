import { Request, Response } from "express";

class RecordController {
    getRecordPage(request: Request, response: Response) {
        response.type('text/html');
        response.render('record', { title: '錄影' });
    }
}

export default RecordController;
