
import toErrorResponse from './response-errors.mjs'

export default function(services){
    return {
        createUser: handleRequest(createUserInternal),
        getUsers: handleRequest(getUsersInternal),
        getMovies: handleRequest(getMoviesInternal),
        getMoviesByName: handleRequest(getMoviesByNameInternal),
        getGroups: handleRequest(getGroupsInternal),
        getGroupById: handleRequest(getGroupByIdInternal),
        deleteGroup: handleRequest(deleteGroupInternal),
        createGroup: handleRequest(createGroupInternal),
        editGroup: handleRequest(editGroupInternal),
        addMovieToGroup: handleRequest(addMovieToGroupInternal),
        deleteMovieFromGroup: handleRequest(deleteMovieFromGroupInternal),
    }
    async function createUserInternal(req,resp){
        const username = req.body.username
        const password = req.body.password
        const newUser = await services.createUser(username,password)
        resp.status(201)
        return{
            status: `User with token ${newUser.token} created with success`,
            newUser: newUser
        }
    }
    async function getUsersInternal(req,resp){
        return services.getUsers()
    }
    async function getMoviesInternal(req,resp){
        return services.getMovies(req.body.limit)
    }
    async function getMoviesByNameInternal(req,resp){
        return services.getMoviesByName(req.body.q,req.body.limit)
    }
    async function getGroupsInternal(req, resp) {
        return services.getGroups(req.token)
    }
    
    async function getGroupByIdInternal(req, resp) {
        const groupId = req.params.groupId
        return services.getGroupById(groupId,req.token)
    }
    
    async function deleteGroupInternal(req, resp) {
        const groupId = req.params.groupId
        const groups = await services.deleteGroup(groupId,req.token)
        resp.status(202)
        return{
            status: `Group with id ${groupId} deleted with success`,
            groups: groups
        }
    }
    
    async function createGroupInternal(req, resp) {
        let newGroup = await services.createGroup(req.body.name,req.body.description,req.token)
        resp.status(201)
        return{
            status: `Group with id ${newGroup.id} created with success`,
            group: newGroup
        }    
    }
    async function editGroupInternal(req, resp) {
        const groupId = req.params.groupId
        const newName = req.body.newName
        const newDescription = req.body.newDescription
        const group = await services.editGroup(groupId,newName,newDescription,req.token)
        resp.status(202)
        return {
            status: `Group with id ${groupId} edited with success`,
            group: group
        }
    }
    async function addMovieToGroupInternal(req,resp){
        const groupId = req.params.groupId
        const movieId = req.body.movieId
        const group = await services.addMovieToGroup(groupId,movieId,req.token)
        return {
            status: `Movie with id ${movieId} added with success to group with id ${groupId}`,
            group: group
        }
    }
    async function deleteMovieFromGroupInternal(req,resp){
        const groupId = req.params.groupId
        const movieId = req.body.movieId
        const group = await services.deleteMovieFromGroup(groupId,movieId,req.token)
        return {
            status: `Movie with id ${movieId} deleted with success from group with id ${groupId}`,
            group: group
        }
    }
    function handleRequest(handler) {
        return async function(req, resp) {
            const BEARER_STR = "Bearer "
            const tokenHeader = req.get("Authorization")
            if(!(tokenHeader && tokenHeader.startsWith(BEARER_STR) && tokenHeader.length > BEARER_STR.length)) {
                resp
                    .status(401)
                    .json({error: `Invalid authentication token`})
                    return
            }
            req.token = tokenHeader.split(" ")[1]
            try {
                let body = await handler(req, resp)
                resp.json(body)
            } catch(e) {
                const response = toErrorResponse(e)
                resp.status(response.status).json(response.body)
            }
        }
    }
}