import { createServer } from "http";
import { readFile } from "fs";
import path from "path";
import imageRouter from "./modules/imageRouter.js";
import tagsRouter from "./modules/tagsRouter.js";

const __dirname = path.resolve();

const PORT = 3000;
createServer((req, res) => {
    //images

    if (req.url.search("/api/photos") != -1) {
        imageRouter(req, res)
    }

    //tags

    else if (req.url.search("/api/tags") != -1) {
        tagsRouter(req, res)
    }
})
    .listen(PORT, () => console.log("Serwer działa na porcie ", PORT))