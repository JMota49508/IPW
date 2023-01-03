
import errors from './errors.mjs'

export default function(movieData,userData){
    if (!movieData) {
        throw errors.INVALID_PARAMETER('movieData')
    }
    if(!userData) {
        throw errors.INVALID_PARAMETER('userData')
    }
    return{
        createUser: createUser,
        getUsers: getUsers,
        getUser: getUser,
        login: login,
        getMovies: getMovies,
        getMoviesByName: getMoviesByName,
        getMovie: getMovie,
        getGroups: getGroups,
        getGroupById: getGroupById,
        editGroup: editGroup,
        deleteGroup: deleteGroup,
        createGroup: createGroup,
        addMovieToGroup: addMovieToGroup,
        deleteMovieFromGroup: deleteMovieFromGroup,
    }
    async function createUser(username,password){
    if(!username) throw errors.INVALID_PARAMETER("username")
    if(!password) throw errors.INVALID_PARAMETER("password")
    return userData.createUser(username,password)
    }
    async function getUsers(){
        return userData.getUsers()
    }
    async function getUser(token){
        if(token=='') throw errors.USER_NOT_FOUND()
        return userData.getUser(token)
    }
    async function login(username,password){
        if(!username) throw errors.INVALID_PARAMETER("username")
        if(!password) throw errors.INVALID_PARAMETER("password")
        return userData.loginUser(username,password)
    }
    async function getMovies(limit=250){
        limit = Number(limit)
        if(isNaN(limit)) {
            throw errors.INVALID_PARAMETER(`limit`)
        }
        return await movieData.getMovies(limit)
    }
    async function getMoviesByName(q,limit=250){
        limit = Number(limit)
        if(isNaN(limit)) {
            throw errors.INVALID_PARAMETER(`limit`)
        }
        return await movieData.getMoviesByName(q,limit)
    }
    async function getMovie(movId){
        if(!movId) throw errors.INVALID_PARAMETER(`limit`)
        return await movieData.getMovie(movId)
    }
    async function getGroups(token){
        let user = userData.getUser(token)
        if(!user) {
            throw errors.USER_NOT_FOUND()
        }
        return userData.getGroups(user)
    }
    async function getGroupById(id,token){  
        if(!id) throw errors.INVALID_PARAMETER("id")
        let user = await userData.getUser(token)
        if(!user) throw errors.USER_NOT_FOUND()
        if(filterGroupId(id,user)) throw errors.GROUP_NOT_FOUND(id)
        return userData.getGroupById(id,user)
    }
    async function createGroup(name,desc,token){
        let user = await userData.getUser(token)
        if(!user) throw errors.USER_NOT_FOUND()
        if(!name) throw errors.INVALID_PARAMETER("name")
        if(filterName(name,user)) throw errors.SAME_NAME()
        return userData.createGroup(name,desc,user,token)
    }
    async function editGroup(id,name,desc,token){
        if(!id) throw errors.INVALID_PARAMETER("id")
        let user = await userData.getUser(token)
        if(!user) throw errors.USER_NOT_FOUND()
        if(filterGroupId(id,user)) throw errors.GROUP_NOT_FOUND(id)
        if(filterName(name,user)) throw errors.SAME_NAME()
        return userData.editGroup(id,name,desc,user,token)
    }
    async function deleteGroup(id,token){
        if(!id) throw errors.INVALID_PARAMETER("id")
        let user = await userData.getUser(token)
        if(user==undefined) throw errors.USER_NOT_FOUND()
        if(filterGroupId(id,user)) throw errors.GROUP_NOT_FOUND(id)
        return userData.deleteGroup(id,user,token)
    }
    async function addMovieToGroup(id,movId,token){
        if(!movId) throw errors.INVALID_PARAMETER("movie id")
        if(!id) throw errors.INVALID_PARAMETER("id")
        let user = await userData.getUser(token)
        if(user==undefined) throw errors.USER_NOT_FOUND()
        if(filterGroupId(id,user)) throw errors.GROUP_NOT_FOUND(id)
        if(filterGroupForMovie(id,movId,user)) errors.ALREADY_ADDED()
        return await userData.addMovieToGroup(id,movId,user,token)
    }
    async function deleteMovieFromGroup(id,movId,token){
        if(!movId) throw errors.INVALID_PARAMETER("movie id")
        if(!id) throw errors.INVALID_PARAMETER("id")
        let user = await userData.getUser(token)
        if(user==undefined) throw errors.USER_NOT_FOUND()
        if(filterGroupId(id,user)) throw errors.GROUP_NOT_FOUND(id)
        if(!filterGroupForMovie(id,movId,user)) throw errors.MOVIE_NOT_PRESENT()
        return await userData.deleteMovieFromGroup(id,movId,user,token)
    }

    // Utility code
    
    function filterGroupId(id,user){
       if(user['groups'].find(g=>g.id==id)==undefined) return true
       return false
   }
   
   function filterName(name,user){
       if(user['groups'].find(g=>g.name==name)==undefined) return false
       return true
   }
   
   function filterGroupForMovie(id,movId,user){
       const group = user['groups'].find(g=>g.id==id)
       if(group.movies.find(m=> m.id==movId)==undefined) return false
       return true
   }
}