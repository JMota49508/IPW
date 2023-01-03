
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
        getMovies: getMovies,
        getMoviesByName: getMoviesByName,
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
    async function getMovies(limit=10){
        limit = Number(limit)
        if(isNaN(limit)) {
            throw errors.INVALID_PARAMETER(`limit`)
        }
        return movieData.getMovies(limit)
    }
    async function getMoviesByName(q,limit=10){
        limit = Number(limit)
        if(isNaN(limit)) {
            throw errors.INVALID_PARAMETER(`limit`)
        }
        return movieData.getMoviesByName(q,limit)
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
        let user = userData.getUser(token)
        if(!user) throw errors.USER_NOT_FOUND()
        if(filterGroupId(id,user)) throw errors.GROUP_NOT_FOUND(id)
        return userData.getGroupById(id,user)
    }
    async function createGroup(name,desc,token){
        let user = userData.getUser(token)
        if(!user) throw errors.USER_NOT_FOUND()
        if(!name) throw errors.INVALID_PARAMETER("name")
        if(filterName(name,user)) throw errors.SAME_NAME()
        return userData.createGroup(name,desc,user)
    }
    async function editGroup(id,name,desc,token){
        if(!id) throw errors.INVALID_PARAMETER("id")
        let user = userData.getUser(token)
        if(!user) throw errors.USER_NOT_FOUND()
        if(filterGroupId(id,user)) throw errors.GROUP_NOT_FOUND(id)
        if(filterName(name,user)) throw errors.SAME_NAME()
        return userData.editGroup(id,name,desc,user)
    }
    async function deleteGroup(id,token){
        if(!id) throw errors.INVALID_PARAMETER("id")
        let user = userData.getUser(token)
        if(user==undefined) throw errors.USER_NOT_FOUND()
        if(filterGroupId(id,user)) throw errors.GROUP_NOT_FOUND(id)
        return userData.deleteGroup(id,user)
    }
    async function addMovieToGroup(id,movId,token){
        if(!movId) throw errors.INVALID_PARAMETER("movie id")
        if(filterMovieId(movId)) throw errors.MOVIE_NOT_FOUND(movId)
        if(!id) throw errors.INVALID_PARAMETER("id")
        let user = userData.getUser(token)
        if(user==undefined) throw errors.USER_NOT_FOUND()
        if(filterGroupId(id,user)) throw errors.GROUP_NOT_FOUND(id)
        if(filterGroupForMovie(id,movId,user)) errors.ALREADY_ADDED()
        return movieData.addMovieToGroup(id,movId,user)
    }
    async function deleteMovieFromGroup(id,movId,token){
        if(!movId) throw errors.INVALID_PARAMETER("movie id")
        if(filterMovieId(movId)) throw errors.MOVIE_NOT_FOUND(movId)
        if(!id) throw errors.INVALID_PARAMETER("id")
        let user = userData.getUser(token)
        if(user==undefined) throw errors.USER_NOT_FOUND()
        if(filterGroupId(id,user)) throw errors.GROUP_NOT_FOUND(id)
        if(!filterGroupForMovie(id,movId,user)) throw errors.MOVIE_NOT_PRESENT()
        return movieData.deleteMovieFromGroup(id,movId,user)
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
   
    function filterMovieId(movId){
        const movies = movieData.getMovies()
        if(movies.find(m=> m.id==movId)==undefined) return true
        return false
    }
   
   function filterGroupForMovie(id,movId,user){
       const group = user['groups'].find(g=>g.id==id)
       if(group.movies.find(m=> m.id==movId)==undefined) return false
       return true
   }
}