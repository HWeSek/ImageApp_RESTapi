import { files_array } from "./model.js";
import jsonController from "./jsonController.js";
import fileController from "./fileController.js";

const imageRouter = async (request, response) => {
    console.log(request.url, request.method);
    switch (request.method) {
        case "GET":
            if (request.url == "/api/photos") {
                response.writeHead(200, "Content-type: application/json;charset=utf-8")
                if (files_array.length == 1) {
                    response.write(JSON.stringify(files_array[0], null, 3));
                } else if (files_array.length > 1) {
                    response.write(JSON.stringify(files_array, null, 3));
                } else {
                    response.write(JSON.stringify("NOTHING", null, 3));
                }
                response.end()

            } else if (new RegExp('^\/api\/photos\/[0-9]+').test(request.url)) {
                let values = request.url.match('^\/api\/photos\/([0-9]+)');
                let id = values[1];
                let data = JSON.stringify(files_array.find(file => file.id == id));
                if(data){
                    response.writeHead(200, "Content-Type: application/json;charset=utf-8")
                    response.write(data, null, 3);
                    response.end()
                }else{
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

            }  else if (new RegExp('^\/api\/photos\/tags\/mass\/[0-9]+').test(request.url)) {
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

            } else {
                response.writeHead(404, "Content-type: application/json;charset=utf-8")
                response.write(JSON.stringify({ status: 404, message: `route does not exist` }, null, 3));
                response.end()
            }
            break;

    }
}

export default imageRouter