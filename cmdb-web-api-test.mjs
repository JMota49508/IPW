
import toHttpResponse from './web/api/response-errors.mjs'

export default function(services){
    return {
        profile: handleRequest(profileInternal),
        createUser: handleRequest(createUserInternal),
        getMovies: handleRequest(getMoviesInternal),
        getMoviesByName: handleRequest(getMoviesByNameInternal),
        getMovie: handleRequest(getMoviesByIdInternal),
        getGroups: handleRequest(getGroupsInternal),
        getGroupById: handleRequest(getGroupByIdInternal),
        createGroup: handleRequest(createGroupInternal),
        deleteGroup: handleRequest(deleteGroupInternal),
        editGroup: handleRequest(editGroupInternal),
        addMovieToGroup: handleRequest(addMovieToGroupInternal),
        deleteMovieFromGroup: handleRequest(deleteMovieFromGroupInternal),
    }
    async function profileInternal(req,rsp){
        const token = req.get('Authorization').split(' ')[1]
        const user = await services.getUser(token)
        return user
    }
    async function createUserInternal(req,rsp){
        const username = req.body.username
        const password = req.body.password
        const user = await services.createUser(username,password)
        rsp.status(201)
        return rsp.json(user)
    }
    async function getMoviesInternal(req,rsp){
        const movies = await services.getMovies(req.body.limit)
        return movies
    }
    async function getMoviesByNameInternal(req,rsp){
        const movies = await services.getMoviesByName(req.body.q,req.body.limit)
        return movies
    }
    async function getMoviesByIdInternal(req,rsp){
        const movie = await services.getMovie(req.params.movieId)
        return movie
    }
    async function getGroupsInternal(req,rsp){
        const token = req.get('Authorization').split(' ')[1]
        const groups = await services.getGroups(token)
        return groups
    }
    async function getGroupByIdInternal(req,rsp){
        const token = req.get('Authorization').split(' ')[1]
        const group = await services.getGroupById(req.params.groupId,token)
        return group
    }
    async function createGroupInternal(req,rsp){
        const token = req.get('Authorization').split(' ')[1]
        const group = await services.createGroup(req.body.name,req.body.description,token)
        rsp.status(201)
        return rsp.json(group)
    }
    async function deleteGroupInternal(req, rsp) {
        const token = req.get('Authorization').split(' ')[1]
        const groupId = req.params.groupId
        const group = await services.deleteGroup(groupId,token)
        rsp.status(202)
        return rsp.json(group)
    }
    async function editGroupInternal(req, rsp) {
        const token = req.get('Authorization').split(' ')[1]
        const groupId = req.params.groupId
        const newName = req.body.newName
        const newDescription = req.body.newDescription
        const group = await services.editGroup(groupId,newName,newDescription,token)
        rsp.status(202)
        return rsp.json(group)
    }
    async function addMovieToGroupInternal(req,rsp){
        const token = req.get('Authorization').split(' ')[1]
        const groupId = req.params.groupId
        const movieId = req.body.movieId
        const group = await services.addMovieToGroup(groupId,movieId,token)
        rsp.status(202)
        return rsp.json(group)
    }
    async function deleteMovieFromGroupInternal(req,rsp){
        const token = req.get('Authorization').split(' ')[1]
        const groupId = req.params.groupId
        const movieId = req.body.movieId
        const group = await services.deleteMovieFromGroup(groupId,movieId,token)
        rsp.status(202)
        return rsp.json(group)
    }
    function handleRequest(handler) {
        return async function(req, rsp) {
            try {
                let body = await handler(req, rsp)
                rsp.json(body)
            } catch(e) {
                const response = toHttpResponse(e)
                rsp.json(response)
            }
        }
    }
}