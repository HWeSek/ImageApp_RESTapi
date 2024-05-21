import { files_array, tags_array } from "./model.js";
import { readFile } from "fs";
import getRequestData from "./utils.js";
import sharp from "sharp";

const filtersController = {
    getMetadata: async (path) => {
        return new Promise(async (resolve, reject) => {
            try {

                if (path) {
                    let meta = await sharp(path)
                        .metadata()
                    resolve(meta)
                }
                else {
                    resolve("url_not_found")
                }

            } catch (err) {
                reject(err.message)
            }
        })
    },
    useFilter: async (req, res) => {
        const data = JSON.parse(await getRequestData(req));
        const id = data.id;
        const filter = data.filter;
        const file = files_array.find(file => file.id == id);
        if (file) {
            try {
                let array = file.url.split("\\")
                let old_name = array.pop()
                let new_name = old_name.split(".")[0] + "-" + filter + '.' + old_name.split(".")[1];
                array.push(new_name)
                const new_url = array.join('\\\\');
                let change = true;
                switch (filter.toLowerCase()) {
                    case "grayscale":
                        await sharp(file.url)
                            .grayscale()
                            .toFile(new_url)
                        break;
                    case "flip":
                        await sharp(file.url)
                            .flip()
                            .toFile(new_url)
                        break;
                    case "tint":
                        await sharp(file.url)
                            .tint(data.rgb)
                            .toFile(new_url)
                        break;
                    case "resize":
                        await sharp(file.url)
                            .resize({ width: data.size.width, height: data.size.height })
                            .toFile(new_url)
                        break;
                    case "crop":
                        await sharp(file.url)
                            .extract({ width: data.size.width, height: data.size.height, top: data.size.top, left: data.size.left })
                            .toFile(new_url)
                        break;
                    case "negate":
                        await sharp(file.url)
                            .negate()
                            .toFile(new_url)
                        break;
                    case "rotate":
                        await sharp(file.url)
                            .rotate(data.rotate)
                            .toFile(new_url)
                        break;
                    default:
                        res.writeHead(200, "Content-Type: application/json;charset=utf-8")
                        res.write(JSON.stringify({ status: 404, message: `There's no such filter: ${filter}` }, null, 3));
                        res.end()
                        change = false;
                        break;
                }
                //////////Zapisanie do JSONA]
                if (change) {
                    file.lastChange = filter
                    file.history.push({
                        status: filter,
                        timestamp: Date.now(),
                        url: new_url
                    });
                    res.writeHead(200, "Content-Type: application/json;charset=utf-8")
                    res.write(JSON.stringify({ status: 404, message: `filter ${filter} has been applied to file: ${id}` }, null, 3));
                    res.end()
                }


            } catch (error) {
                res.writeHead(404, "Content-Type: application/json;charset=utf-8")
                res.write(JSON.stringify({ status: 500, message: error }, null, 3));
                res.end()
            }
        } else {
            res.writeHead(404, "Content-Type: application/json;charset=utf-8")
            res.write(JSON.stringify({ status: 404, message: `file with id ${id} not found` }, null, 3));
            res.end()
        }
    },
    getFilteredImage: async (res, id, type) => {
        const file = files_array.find(file => file.id == id);
        if (file) {
            let array = file.url.split("\\")
            let name = array.pop()
            let to_read = name.split(".")[0] + "-" + type + '.' + name.split(".")[1];
            array.push(to_read)
            const new_url = array.join('\\\\');
            readFile(new_url, (err, data) => {
                if (!err) {
                    res.writeHead(200, "Content-Type: image/png")
                    res.write(data, null, 3);
                    res.end()
                } else {
                    res.writeHead(404, "Content-Type: application/json;charset=utf-8")
                    res.write(JSON.stringify({ status: 404, message: `No such file` }, null, 3));
                    res.end()
                }

            })
        } else {
            res.writeHead(404, "Content-Type: application/json;charset=utf-8")
            res.write(JSON.stringify({ status: 404, message: `file with id ${id} not found` }, null, 3));
            res.end()
        }
    }
}
export default filtersController