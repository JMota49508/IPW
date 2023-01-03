import fetch from "node-fetch"
import crypto from 'crypto'
import errors from './errors.mjs'

const key = `k_701ltljd`
const URL = `https://imdb-api.com/en/API/AdvancedSearch/${key}?title_type=feature`
const URLGET = `https://imdb-api.com/en/API/AdvancedSearch/${key}`
const URLID = `https://imdb-api.com/en/API/Title/${key}/`
const infoData = ['id','title','runtimeMins']
const infoDataById = ['id', 'title','runtimeMins','plot',"directors","stars","genres","image"]


async function getMovies(limit){
    const res = await fetch(URL)
    return await res.json()
        .then(movies => movies['results'].slice(0,limit))
}

async function getMoviesByName(q,limit){
    //const predicate = q ? m => m.title.includes(q) : m => true
    const res = await fetch(URLGET+`?title=${q}&title_type=feature`)
    return await res.json()
        .then(movies => movies['results'].slice(0,limit))//.filter(predicate).slice(0,limit))
}

async function getMovie(movId){
    const rsp = await fetch(URLID+movId)
    return await rsp.json()
        .then(mov=>{
            let m = filterProperties(infoDataById,mov)
            return m
        })
}

async function addMovieToGroup(id,movId,user){
    const u = URLID + movId
    const res = await fetch(u)
    const m = await res.json()
    const y = await Promise.resolve(m)
    const movie = filterProperties(infoData,y)
    if(!movie.title) throw errors.MOVIE_NOT_FOUND(movId)
    return movie
}

// Utility code

function filterProperties(a,obj){
    let filtered = Object.keys(obj).filter(key => a.includes(key)).reduce((object,key) =>{
        object[key] = obj[key]
        return object
    },{})
    return filtered
}

export const movieData ={
    getMovies,
    getMoviesByName,
    getMovie,
    addMovieToGroup
}

export default movieData