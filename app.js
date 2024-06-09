import "dotenv/config";
import { createServer } from "http";
import path from "path";
import imageRouter from "./modules/routers/imageRouter.js";
import tagsRouter from "./modules/routers/tagsRouter.js";
import filtersRouter from "./modules/routers/filtersRouter.js";
import userRouter from "./modules/routers/userRouter.js";
import profileRouter from "./modules/routers/profileRouter.js";

import jsonwebtoken from 'jsonwebtoken';

const { verify } = jsonwebtoken;

import { expired_tokens } from "./modules/model.js";

const __dirname = path.resolve();

createServer(async (req, res) => {
    ////CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    /////
    let authorization = false;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            let token = req.headers.authorization.split(" ")[1]
            let decoded = verify(token, process.env.SECRET_KEY);
            if (decoded) {
                authorization = true;
            }
            if (expired_tokens.includes(token)) {
                authorization = false;
            }
        } catch (error) {
            authorization = false;
        }
    }


    if (authorization) {
        //images
        if (req.url.search("/api/photos") != -1) {
            await imageRouter(req, res)
        }

        //tags router
        else if (req.url.search("/api/tags") != -1) {
            await tagsRouter(req, res)
        }

        //filters router
        else if (req.url.search("/api/filters") != -1) {
            await filtersRouter(req, res)
        }
        else if (req.url.search("/api/user") != -1) {
            await userRouter(req, res)
        }
        else if (req.url.search("/api/profile") != -1) {
            await profileRouter(req, res)
        }
        else if (req.url.search("/api/logout") != -1) {
            await profileRouter(req, res)
        }
    } else if (req.url.search("/api/user") != -1) {
        await userRouter(req, res)
    } else if ((req.url.search("/api/photos") != -1 || req.url.search("/api/getimage") != -1) && req.method == "GET") {
        await imageRouter(req, res)
    } else if ((req.url.search("/api/profile") != -1) && req.method == "GET") {
        await profileRouter(req, res)
    } else {
        res.writeHead(401, "Content-type: application/json;charset=utf-8")
        res.write(JSON.stringify({ status: 401, message: "Not authorized!" }, null, 3));
        res.end();
    }



})
    .listen(process.env.APP_PORT, () => console.log("Serwer działa na porcie ", process.env.APP_PORT))