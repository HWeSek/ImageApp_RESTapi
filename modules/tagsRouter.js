import { tags_array } from "./model.js";
import tagsController from "./tagsController.js";

const tagsRouter = async (request, response) => {
    console.log(request.url, request.method);
    switch (request.method) {
        case "GET":
            if (request.url == "/api/tags") {
                response.writeHead(200, "Content-type: application/json;charset=utf-8")
                if (tags_array.length == 1) {
                    response.write(JSON.stringify(tags_array[0], null, 3));
                } else if (tags_array.length > 1) {
                    response.write(JSON.stringify(tags_array, null, 3));
                } else {
                    response.write(JSON.stringify("NOTHING", null, 3));
                }
                response.end()

            } else if (request.url == "/api/tags/raw") {
                tagsController.readRaw(response);
            } else if (new RegExp('^\/api\/tags\/[0-9]+').test(request.url)) {
                let values = request.url.match('^\/api\/tags\/([0-9]+)');
                let id = values[1];
                try {
                    response.writeHead(200, "Content-Type: application/json;charset=utf-8")
                    response.write(JSON.stringify(tags_array.find(file => file.id == id), null, 3));
                    response.end()
                } catch (error) {
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
            if (request.url == "/api/tags") {
                tagsController.addTag(request, response)

            } else {
                response.writeHead(404, "Content-type: application/json;charset=utf-8")
                response.write(JSON.stringify({ status: 404, message: `route does not exist` }, null, 3));
                response.end()
            }
            break;
        case "DELETE":
            if (new RegExp('^\/api\/tags\/[0-9]+').test(request.url)) {
                let values = request.url.match('^\/api\/tags\/([0-9]+)');
                let id = values[1];
                if (tags_array.indexOf(tags_array.find(file => file.id == id)) != -1) {
                    fileController.deleteFile(id)
                    response.writeHead(202, "Content-Type: application/json;charset=utf-8")
                    response.write(JSON.stringify({ status: 202, message: `file with id ${id} deleted sucessfully` }), null, 3);
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
    }
}

export default tagsRouter