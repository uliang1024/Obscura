import { Request, Response } from "express";

class HomeController {
    echo(request: Request, response: Response) {
        response.type('text/html');
        response.render('home', { title: '首頁' });
    }
}

export default HomeController;