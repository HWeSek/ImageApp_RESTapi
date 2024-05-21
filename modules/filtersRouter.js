import { files_array } from "./model.js";
import filtersController from "./filtersController.js";
import { readFileSync } from "fs";

const filtersRouter = async (request, response) => {
    console.log(request.url, request.method);
    switch (request.method) {
        case "GET":
            if (request.url == "/api/filters") {


            } else if (new RegExp('^\/api\/filters\/metadata\/[0-9]+').test(request.url)) {
                let values = request.url.match('^\/api\/filters\/metadata\/([0-9]+)');
                let id = values[1];
                const file = files_array.find(file => file.id == id);
                if (file) {
                    const output = await filtersController.getMetadata(file.url);
                    response.writeHead(200, "Content-Type: image/png")
                    response.write(JSON.stringify(output, null, 4), null, 3);
                    response.end()
                } else {
                    response.writeHead(404, "Content-Type: application/json;charset=utf-8")
                    response.write(JSON.stringify({ status: 404, message: `file with id ${id} not found` }, null, 3));
                    response.end()
                }
            } else if (new RegExp('^\/api\/getimage\/[0-9]+\/filter\/.+').test(request.url)) {
                const values = request.url.match('^\/api\/getimage\/([0-9]+)\/filter\/(.+)');
                const id = values[1];
                const name = values[2];
                filtersController.getFilteredImage(response, id, name);



            } else if (new RegExp('^\/api\/getimage\/[0-9]+').test(request.url)) {
                let values = request.url.match('^\/api\/getimage\/([0-9]+)');
                let id = values[1];
                const file = files_array.find(file => file.id == id);
                if (file) {
                    const image = readFileSync(file.url);
                    response.writeHead(200, "Content-Type: application/json;charset=utf-8")
                    response.write(image, null, 3);
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
                filtersController.useFilter(request, response);
            } else {
                response.writeHead(404, "Content-type: application/json;charset=utf-8")
                response.write(JSON.stringify({ status: 404, message: `route does not exist` }, null, 3));
                response.end()
            }
            break;

    }
}

export default filtersRouter