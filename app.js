import { createServer } from "http";
import { readFile } from "fs";
import path from "path";
import router from "./modules/router.js";

const __dirname = path.resolve();

const PORT = 3000;
createServer((req, res) => router(req, res))
    .listen(PORT, () => console.log("Serwer działa na porcie ", PORT))