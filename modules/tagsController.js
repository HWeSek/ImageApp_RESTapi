import { tags_array } from "./model.js";
import getRequestData from "./utils.js";

const tagsController = {
    addTag: async (req, res) => {
        const name = JSON.parse(await getRequestData(req)).value;
        res.writeHead(200, "Content-type: application/json;charset=utf-8")
        if (!tags_array.find(element => element.name == name)) {
            const id = tags_array.length;
            const tag = {
                id: id,
                name: name,
                popularity: 0
            }
            tags_array.push(tag)
            res.write(JSON.stringify(tag, null, 3));
        } else {
            res.write(JSON.stringify({ error: "Tag already exists!" }, null, 3));
        }
        res.end()
    },
    readRaw: (res) => {
        let tags = []
        for (let tag of tags_array) {
            tags.push(tag.name);
        }

        res.writeHead(200, "Content-type: application/json;charset=utf-8")
        res.write(JSON.stringify(tags, null, 3));
        res.end()
    }
}

export default tagsController