import { users_array } from "../model.js";
import profileController from "../controllers/profileController.js";

const profileRouter = async (request, response) => {
    switch (request.method) {
        case "GET":
            if (request.url == "/api/profile") {
                profileController.getOwnProfileData(request, response);

            } else if (new RegExp('^\/api\/profile\/picture\/.+').test(request.url)) {

                let values = request.url.match('^\/api\/profile\/picture\/(.+)');
                let email = values[1];
                profileController.getProfilePicture(response, email);
            } else if (new RegExp('^\/api\/profile\/.+').test(request.url)) {

                let values = request.url.match('^\/api\/profile\/(.+)');
                let email = values[1];
                profileController.getProfileData(response, email);
            } else if (request.url == "/api/logout") {
                profileController.logout(request, response);
            }
            else {
                response.writeHead(404, "Content-type: application/json;charset=utf-8")
                response.write(JSON.stringify({ status: 404, message: `route does not exist` }, null, 3));
                response.end()
            }
            break;
        case "POST":
            if (request.url == "/api/profile") {
                profileController.uploadProfilePicture(request, response);
            } else {
                response.writeHead(404, "Content-type: application/json;charset=utf-8")
                response.write(JSON.stringify({ status: 404, message: `route does not exist` }, null, 3));
                response.end()
            }
            break;
        case "DELETE":

            break;
        case "PATCH":
            if (request.url == "/api/profile") {
                profileController.editProfileData(request, response);
            } else {
                response.writeHead(404, "Content-type: application/json;charset=utf-8")
                response.write(JSON.stringify({ status: 404, message: `route does not exist` }, null, 3));
                response.end()
            }
            break;

    }
}

export default profileRouter