const suggestedTags = require("../models/SuggestedTag");
const unlistedTags = require("../models/UnlistedTag");
const { AppError } = require('../utils/AppError');


async function createSuggestedTag(newTag) {
    try{
        await suggestedTags.create(newTag);
    }catch(e){
        console.log("Error createSuggestedTag: ",e)
        throw e;
    }
}


async function createUnlistedTag(newTag) {
    try{
        await unlistedTags.create(newTag);
    }catch(e){
        console.log("Error createUnlistedTag: ",e)
        throw e;
    }
}


async function updateUnlistedTagCount(id) {
    try{
        await unlistedTags.updateOne({ _id: id}, { $inc: { vecesDetectada: 1 } });
    }catch(e){
        console.log("Error createUnlistedTag: ",e)
        throw e;
    }
}


module.exports={
    createSuggestedTag,
    createUnlistedTag,
    updateUnlistedTagCount
}