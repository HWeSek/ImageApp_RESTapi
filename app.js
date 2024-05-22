import "dotenv/config";
import { createServer } from "http";
import { readFile } from "fs";
import path from "path";
import imageRouter from "./modules/imageRouter.js";
import tagsRouter from "./modules/tagsRouter.js";
import filtersRouter from "./modules/filtersRouter.js";
import userRouter from "./modules/userRouter.js";

const __dirname = path.resolve();

createServer(async (req, res) => {
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

    else if (req.url.search("/api/getimage") != -1) {
        await filtersRouter(req, res)
    }

    else if (req.url.search("/api/user") != -1) {
        await userRouter(req, res)
    }


})
    .listen(process.env.APP_PORT, () => console.log("Serwer działa na porcie ", process.env.APP_PORT))