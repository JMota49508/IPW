
import toHttpResponse from './web/api/response-errors.mjs'

export default function(services){
    return {
        deleteGroup: handleRequest(deleteGroupInternal),
        editGroup: handleRequest(editGroupInternal),
        addMovieToGroup: handleRequest(addMovieToGroupInternal),
        deleteMovieFromGroup: handleRequest(deleteMovieFromGroupInternal),
    }
    async function deleteGroupInternal(req, rsp) {
        const groupId = req.params.groupId
        return await services.deleteGroup(groupId,req.user.token)
    }
    async function editGroupInternal(req, rsp) {
        const groupId = req.body.groupId
        const newName = req.body.newName
        const newDescription = req.body.newDescription
        const group = await services.editGroup(groupId,newName,newDescription,req.user.token)
        return group
    }
    async function addMovieToGroupInternal(req,rsp){
        const groupId = req.params.groupId
        const movieId = req.params.movieId
        const group = await services.addMovieToGroup(groupId,movieId,req.user.token)
        return group
    }
    async function deleteMovieFromGroupInternal(req,rsp){
        const groupId = req.params.groupId
        const movieId = req.params.movieId
        const group = await services.deleteMovieFromGroup(groupId,movieId,req.user.token)
        return group
    }
    function handleRequest(handler) {
        return async function(req, rsp) {
            try {
                let body = await handler(req, rsp)
                rsp.json(body)
            } catch(e) {
                const response = toHttpResponse(e)
                rsp.render('errorPage.hbs',{response})
            }
        }
    }
}