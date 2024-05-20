import { files_array } from "./model.js";
import jsonController from "./jsonController.js";
import fileController from "./fileController.js";
import filtersController from "./filtersController.js";

const filtersRouter = async (request, response) => {
    console.log(request.url, request.method);
    switch (request.method) {
        case "GET":
            if (request.url == "/api/filters") {


            } else if (new RegExp('^\/api\/filters\/metadata\/[0-9]+').test(request.url)) {
                let values = request.url.match('^\/api\/filters\/metadata\/([0-9]+)');
                let id = values[1];
                let data = JSON.stringify(files_array.find(file => file.id == id));
                if (data) {
                    response.writeHead(200, "Content-Type: application/json;charset=utf-8")
                    response.write(data, null, 3);
                    response.end()
                } else {
                    response.writeHead(404, "Content-Type: application/json;charset=utf-8")
                    response.write(JSON.stringify({ status: 404, message: `file with id ${id} not found` }, null, 3));
                    response.end()
                }
            } else {
                response.writeHead(404, "Content-type: application/json;charset=utf-8")
                response.write(JSON.stringify({ status: 404, message: `route does not exist` }, null, 3));
                response.end()
            }
            break;
        case "POST":
            if (request.url == "/api/filters") {

            } else if (new RegExp('^\/api\/photos\/tags\/mass\/[0-9]+').test(request.url)) {

            } else {
                response.writeHead(404, "Content-type: application/json;charset=utf-8")
                response.write(JSON.stringify({ status: 404, message: `route does not exist` }, null, 3));
                response.end()
            }
            break;
        case "DELETE":
            if (new RegExp('^\/api\/photos\/[0-9]+').test(request.url)) {


            } else {
                response.writeHead(404, "Content-type: application/json;charset=utf-8")
                response.write(JSON.stringify({ status: 404, message: `route does not exist` }, null, 3));
                response.end()
            }
            break;
        case "PATCH":
            if (request.url == "/api/filters") {


            } else {
                response.writeHead(404, "Content-type: application/json;charset=utf-8")
                response.write(JSON.stringify({ status: 404, message: `route does not exist` }, null, 3));
                response.end()
            }
            break;

    }
}

export default filtersRouter