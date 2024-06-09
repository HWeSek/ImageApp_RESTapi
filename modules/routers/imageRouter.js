import { files_array } from "../model.js";
import jsonController from "../controllers/jsonController.js";
import fileController from "../controllers/fileController.js";
import filtersController from "../controllers/filtersController.js";
import { readFileSync } from "fs";

const imageRouter = async (request, response) => {

    switch (request.method) {
        case "GET":
            if (request.url == "/api/photos") {
                response.writeHead(200, "Content-type: application/json;charset=utf-8")
                if (files_array.length > 0) {
                    response.write(JSON.stringify(files_array, null, 3));
                } else {
                    response.write(JSON.stringify("There are no posts", null, 3));
                }
                response.end()

            } else if (new RegExp('^\/api\/photos\/[0-9]+').test(request.url)) {
                let values = request.url.match('^\/api\/photos\/([0-9]+)');
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
            } else if (new RegExp('^\/api\/photos\/tags\/[0-9]+').test(request.url)) {
                let values = request.url.match('^\/api\/photos\/tags\/([0-9]+)');
                let id = values[1];
                let file = files_array.find(file => file.id == id);
                if (file) {
                    response.writeHead(200, "Content-Type: application/json;charset=utf-8")
                    let output = {
                        id: id,
                        tags: file.tags
                    }
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
                    const stateFlag = file.lastChange;

                    const state = file.history.find(file => file.status == stateFlag)

                    const image = readFileSync(state.url);
                    response.writeHead(200, "Content-Type: application/json;charset=utf-8")
                    response.write(image);
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
            if (request.url == "/api/photos") {
                let data = await fileController.saveFile(request, response);
                jsonController.addJSON(data)
                response.writeHead(200, "Content-type: application/json;charset=utf-8")
                response.write(JSON.stringify(data, null, 3));
                response.end()

            } else {
                response.writeHead(404, "Content-type: application/json;charset=utf-8")
                response.write(JSON.stringify({ status: 404, message: `route does not exist` }, null, 3));
                response.end()
            }
            break;
        case "DELETE":
            if (new RegExp('^\/api\/photos\/[0-9]+').test(request.url)) {
                let values = request.url.match('^\/api\/photos\/([0-9]+)');
                let id = values[1];
                if (files_array.indexOf(files_array.find(file => file.id == id)) != -1) {
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
        case "PATCH":
            if (new RegExp('^\/api\/photos\/[0-9]+').test(request.url)) {
                let values = request.url.match('^\/api\/photos\/([0-9]+)');
                let id = values[1];
                if (files_array.indexOf(files_array.find(file => file.id == id)) != -1) {
                    jsonController.editJSON(request, id)
                    response.writeHead(202, "Content-Type: application/json;charset=utf-8")
                    response.write(JSON.stringify({ status: 202, message: `file with id ${id} updated sucessfully` }), null, 3);
                    response.end()
                } else {
                    response.writeHead(404, "Content-Type: application/json;charset=utf-8")
                    response.write(JSON.stringify({ status: 404, message: `file with id ${id} not found` }, null, 3));
                    response.end()
                }

            } else if (new RegExp('^\/api\/photos\/tags\/mass\/[0-9]+').test(request.url)) {
                let values = request.url.match('^\/api\/photos\/tags\/mass\/([0-9]+)');
                let id = values[1];
                if (files_array.indexOf(files_array.find(file => file.id == id)) != -1) {
                    jsonController.addTagMass(id, request, response);
                } else {
                    response.writeHead(404, "Content-Type: application/json;charset=utf-8")
                    response.write(JSON.stringify({ status: 404, message: `file with id ${id} not found` }, null, 3));
                    response.end()
                }
            } else if (new RegExp('^\/api\/photos\/tags\/[0-9]+').test(request.url)) {
                let values = request.url.match('^\/api\/photos\/tags\/([0-9]+)');
                let id = values[1];
                if (files_array.indexOf(files_array.find(file => file.id == id)) != -1) {
                    jsonController.addTag(id, request, response);
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

export default imageRouter