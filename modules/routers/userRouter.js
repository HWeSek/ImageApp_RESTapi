import userController from "../controllers/userController.js";
import { users_array } from "../model.js";

const userRouter = async (request, response) => {

    switch (request.method) {
        case "GET":
            if (request.url == "/api/user") {
                response.writeHead(200, "Content-type: application/json;charset=utf-8")
                if (users_array.length == 1) {
                    response.write(JSON.stringify(users_array[0], null, 3));
                } else if (users_array.length > 1) {
                    response.write(JSON.stringify(users_array, null, 3));
                } else {
                    response.write(JSON.stringify("No users have been added", null, 3));
                }
                response.end()
            } else if (new RegExp('^\/api\/user\/confirm\/.+').test(request.url)) {
                if (new RegExp('^\/api\/user\/confirm\/eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/]+').test(request.url)) {
                    const values = request.url.match('^\/api\/user\/confirm\/(.+)');
                    const token = values[1];
                    userController.confirmUser(token, response)
                } else {
                    response.writeHead(400, "Content-type: application/json;charset=utf-8")
                    response.write(JSON.stringify({ status: 400, message: "Wrong token!" }, null, 3));
                    response.end();
                }
            }
            else {
                response.writeHead(404, "Content-type: application/json;charset=utf-8")
                response.write(JSON.stringify({ status: 404, message: `route does not exist` }, null, 3));
                response.end()
            }
            break;
        case "POST":
            if (request.url == "/api/user/register") {
                userController.registerUser(request, response);
            } else if (request.url == "/api/user/login") {
                userController.userLogin(request, response);
            } else {
                response.writeHead(404, "Content-type: application/json;charset=utf-8")
                response.write(JSON.stringify({ status: 404, message: `route does not exist` }, null, 3));
                response.end()
            }
            break;
        case "DELETE":

            break;
        case "PATCH":
            if (request.url == "/api/user") {

            } else {
                response.writeHead(404, "Content-type: application/json;charset=utf-8")
                response.write(JSON.stringify({ status: 404, message: `route does not exist` }, null, 3));
                response.end()
            }
            break;

    }
}

export default userRouter