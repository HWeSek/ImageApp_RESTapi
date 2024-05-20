import { files_array, tags_array } from "./model.js";
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
                reject(err.mesage)
            }
        })
    }
}

export default filtersController