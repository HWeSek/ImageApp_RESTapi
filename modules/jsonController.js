import { files_array, tags_array } from "./model.js";
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
    addTag: async (id, request ,response)=>{
        let file = files_array.find(file => file.id == id);
        let tag = JSON.parse(await getRequestData(request)).value;
        if(!new RegExp('^#.+').test(tag)) tag = "#"+tag;
        if(tags_array.indexOf(tags_array.find(tags => tags.name == tag)) == -1){
            if (!tags_array.find(element => element.name == tag)) {
                const id = tags_array.length;
                const newtag = {
                    id: id,
                    name: tag,
                    popularity: 0
                }
                tags_array.push(newtag)
            } 
        }
        if(tags_array.indexOf(tags_array.find(tags => tags.name == tag)) != -1){
            file.tags.push(tag);
            let the_tag = tags_array.find(tags => tags.name == tag);
            the_tag.popularity++;
            response.writeHead(202, "Content-Type: application/json;charset=utf-8")
            response.write(JSON.stringify({ status: 202, message: `file with id ${id} updated with tag ${tag}` }), null, 3);
            response.end()
         } 

    },
    addTagMass: async (id, request, response)=>{
        let file = files_array.find(file => file.id == id);
        let tags = JSON.parse(await getRequestData(request)).value;
        for(let tag of tags){
            if(!new RegExp('^#.+').test(tag)) tag = "#"+tag;
            if(tags_array.indexOf(tags_array.find(tags => tags.name == tag)) == -1){
                if (!tags_array.find(element => element.name == tag)) {
                    const id = tags_array.length;
                    const newtag = {
                        id: id,
                        name: tag,
                        popularity: 0
                    }
                    tags_array.push(newtag)
                } 
            }
            if(tags_array.indexOf(tags_array.find(tags => tags.name == tag)) != -1){
                file.tags.push(tag);
                let the_tag = tags_array.find(tags => tags.name == tag);
                the_tag.popularity++;
             } 
        }
        response.writeHead(202, "Content-Type: application/json;charset=utf-8")
        response.write(JSON.stringify({ status: 202, message: `file with id ${id} updated with tags` }), null, 3);
        response.end()
    },
}

export default jsonController