import { files_array } from "./model.js";
import getRequestData from "./utils.js";

const jsonController = {
    addJSON: (data) => {
        if (data)
            files_array.push(data)
    },
    editJSON: async (req, id) => {
        let data = JSON.parse(await getRequestData(req))
        if (data) {

            let file = files_array.find(files => files.id == id);
            file = Object.assign(files_array.find(files => files.id == id), data)
            const changes = String(file.history.length);

            if (!data.changeName) data.changeName = '';
            if (!data.url) data.url = file.url;
            file.url = data.url;
            file.originalName = data.originalName;
            file.lastChange = data.changeName + changes;
            file.history.push({
                status: file.lastChange,
                oldUrl: data.url,
                lastModifiedDate: Date.now()
            })
        }
    },
}

export default jsonController