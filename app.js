import { createServer } from "http";
import { readFile } from "fs";
import path from "path";
import imageRouter from "./modules/imageRouter.js";
import tagsRouter from "./modules/tagsRouter.js";
import filtersRouter from "./modules/filtersRouter.js";

const __dirname = path.resolve();

const PORT = 3000;
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
})
    .listen(PORT, () => console.log("Serwer działa na porcie ", PORT))