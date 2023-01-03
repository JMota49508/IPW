// Module manages application tasks data.
// In this specific module, data is stored in memory

import fetch from "node-fetch"
import crypto from 'crypto'
import movieData from "./cmdb-movies-data.mjs"

const users = [
    { id: 1, name:"JoaoMota", password:"IPW1",token: "1c884cbc-204f-4dc7-9b37-0555275ea3e7",nextGroupId:1,groups:[]}
]

const baseURL = "http://localhost:9200/"

async function createUser(username,password){
    let bearer_token = crypto.randomUUID()
    const body = {
        name: username,
        password: password,
        token: bearer_token,
        nextGroupId:1,
        groups:[]
    }
    return await fetch(baseURL + `users/_doc?refresh=wait_for`,{
        method: "POST",
        body: JSON.stringify(body),
        headers:{
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    })
    .then(rsp=> rsp.json())
}

async function getUser(token){
    return await fetch(baseURL + `users/_search?q=token:"${token}"`,{
        headers:{ "Accept":"application/json" }
    })
    .then(rsp=> rsp.json())
    .then(body=> body.hits.hits[0]._source )
}

function getUsers(){
    return fetch(baseURL + `users/_search`,{
        headers:{ "Accept":"application/json" }
        .then(rsp=> rsp.json())
        .then(body=> body.hits.hits.map(u=>{ return { id:u._id, user:u._source } }))
    })
}

async function loginUser(username,password){
    return await fetch(baseURL + `users/_search?q=name:"${username}"password:"${password}"`,{
        headers:{ "Accept":"application/json" }
    })
    .then(rsp=> rsp.json())
    .then(body=> body.hits.hits[0]._source)
}


async function createGroup(name,desc,user,token){
    const aux = user
    const id = await getId(token)
    const group = { id:user.nextGroupId, name:name , description:desc , movies: [] , totalDuration:0 } 
    if(!desc) group.description=""
    aux['groups'].push(group)
    aux['nextGroupId']++
    const body = {
        doc:{
            nextGroupId:aux.nextGroupId,
            groups:aux.groups
        }
    }
    return await fetch(baseURL + `users/_update/${id}`,{
        method: "POST",
        body: JSON.stringify(body),
        headers:{ 
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    })
    .then (rsp=> rsp.json())
    .then(Promise.resolve(group))
}

function getGroups(user){
    return user.groups
}
 
function getGroupById(id,user){
    return Promise.resolve(user.groups.find(g => g.id == id))
}

async function editGroup(id,name,desc,user,token){
    const aux = user.groups
    const _id = await getId(token)
    aux.map(g=>{
        if(g.id==id){
            g.name=name
            g.description=desc
        }
    })
    const body = {
        doc:{
            groups:aux
        }
    }
    return await fetch(baseURL + `users/_update/${_id}`,{
        method: "POST",
        body: JSON.stringify(body),
        headers:{ 
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    })
    .then(rsp=> rsp.json())
    .then(Promise.resolve(aux.find(g => g.id == id)))
}

async function deleteGroup(id,user,token){
    const aux = user.groups
    const _id = await getId(token)
    const i = aux.findIndex(g=> g.id==id)
    aux.splice(i,1)
    const body = {
        doc:{
            groups:aux
        }
    }
    return await fetch(baseURL + `users/_update/${_id}`,{
        method: "POST",
        body: JSON.stringify(body),
        headers:{ 
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    })
    .then(rsp=> rsp.json())
    .then(aux)
}

async function addMovieToGroup(id,movId,user,token){
    const movie = await movieData.addMovieToGroup(id,movId,user)
    const aux = user.groups
    const _id = await getId(token)
    aux.map(g=>{
        if(g.id==id){
            g.movies.push(movie)
            g.totalDuration+=parseInt(movie.runtimeMins)
        }
    })
    const body = {
        doc:{
            groups:aux
        }
    }
    return await fetch(baseURL + `users/_update/${_id}`,{
        method: "POST",
        body: JSON.stringify(body),
        headers:{ 
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    })
    .then(rsp=> rsp.json())
    .then(Promise.resolve(aux.find(g => g.id == id)))
}

async function deleteMovieFromGroup(id,movId,user,token){
    const aux = user.groups
    const _id = await getId(token)
    aux.map(g=>{
        if(g.id==id){
            const i = g.movies.findIndex(m=> m.id==movId)
            g.totalDuration-=parseInt(g.movies[i].runtimeMins)
            g.movies.splice(i,1)
        }
    })
    const body = {
        doc:{
            groups:aux
        }
    }
    return await fetch(baseURL + `users/_update/${_id}`,{
        method: "POST",
        body: JSON.stringify(body),
        headers:{ 
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    })
    .then(rsp=> rsp.json())
    .then(Promise.resolve(aux.find(g => g.id == id)))
}

async function getId(token){
    return await fetch(baseURL + `users/_search?q=token:"${token}"`,{
        headers:{ "Accept":"application/json" }
    })
    .then(rsp=> rsp.json())
    .then(body=> body.hits.hits[0]._id)
}


export const userData ={
    createUser,
    getUser,
    getUsers,
    loginUser,
    createGroup,
    getGroups,
    getGroupById,
    editGroup,
    deleteGroup,
    addMovieToGroup,
    deleteMovieFromGroup
}

export default userData