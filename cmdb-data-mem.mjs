import movieData from "./moviesData.json" assert {type: 'json'}
import crypto from 'crypto'

const users = [
    { id: 1, name:"João Mota", password:"G10-IPW1",token: "1c884cbc-204f-4dc7-9b37-0555275ea3e7",nextGroupId:1,groups:[] },
    { id: 2, name:"Test User", password:"G10-IPW2",token: "2c884cbc-204f-4dc7-9b37-0555275ea3e7",nextGroupId:1,groups:[] }
]

let movies = []

function createUser(username,password){
    let nextID = users.length+1
    let bearer_token = crypto.randomUUID()
    const user = { id:nextID, name:username, password:password, token:bearer_token, nextGroupId:1, groups:[] }
    users.push(user)
    return Promise.resolve(user)
}

function getUser(token){
    const user = users.find(u=>u.token==token)
    return user
}

function getUsers(){
    return users
}

function loginUser(username,password){
    const user = users.find(u=>u.name==username && u.password==password)
    return user
}

function getMovies(limit){
    movies=[]
    movieData['movieData'].forEach(mData=> movies.push(mData))
    return movies.slice(0,limit)
}

function getMoviesByName(q,limit){
    movies=[]
    movieData['movieData'].forEach(mData=> movies.push(mData))
    const predicate = q ? m => m.title.includes(q) : m => true
    const retMovies = movies.filter(predicate)
    return retMovies.slice(0,limit)
}

function getMovie(movId){
    movieData['movieData'].forEach(mData=> movies.push(mData))
    const movie = movieData['movieData'].find(m=> m.id==movId)
    return movie
}

function createGroup(name,desc,user){
    if(!desc){
        const group ={ id:user.nextGroupId, name:name , description:"" , movies: [] , totalDuration:0 }
        user['groups'].push(group)
        user['nextGroupId']++
        return Promise.resolve(group)}
    else{
        const group ={ id:user.nextGroupId, name:name , description:desc , movies: [] , totalDuration:0 }
        user['groups'].push(group)
        user['nextGroupId']++
        return Promise.resolve(group)
    }
}

function getGroups(user){
    return user.groups
 }
 
function getGroupById(id,user){
    return Promise.resolve(user.groups.find(g => g.id == id))
}

function editGroup(id,name,desc,user){
    const group = user.groups.find(g=> g.id==id)
    group.name = name
    group.description = desc
    return Promise.resolve(group)
}

function deleteGroup(id,user){
    const i = user.groups.findIndex(g=> g.id==id)
    user.groups.splice(i,1)
    return Promise.resolve(user.groups)
}

function addMovieToGroup(id,movId,user){
    const movie = movies.find(m=> m.id==movId)
    user.groups[id-1].movies.push(movie)
    user.groups[id-1].totalDuration+=movie.duration
    return Promise.resolve(user.groups[id-1])
}

function deleteMovieFromGroup(id,movId,user){
    const group = user.groups[id-1]
    const i = group.movies.findIndex(m=> m.id==movId)
    user.groups[id-1].totalDuration-=group.movies[i].duration
    user.groups[id-1].movies.splice(i,1)
    return Promise.resolve(user.groups[id-1])
}

const dataUsers ={
    createUser,
    getUser,
    getUsers,
    loginUser,
    createGroup,
    getGroups,
    getGroupById,
    editGroup,
    deleteGroup,
}

const dataMovies={
    getMovies,
    getMoviesByName,
    getMovie,
    addMovieToGroup,
    deleteMovieFromGroup
}

export const data ={
    users,
    movies,
    dataUsers,
    dataMovies,
}

export default data