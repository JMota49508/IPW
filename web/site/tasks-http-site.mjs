// Module that contains the functions that handle all HTTP APi requests.
// Handle HTTP request means:
//  - Obtain data from requests. Request data can be obtained from: URI(path, query, fragment), headers, body
//  - Invoke the corresponding operation on services
//  - Generate the response in HTML format

import url from 'url'
import errors from '../../errors.mjs';
import toHttpResponse from '../api/response-errors.mjs'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
let HAMMER_TOKEN = ''

export default function (services) {
    if(!services) throw errors.INVALID_PARAMETER('services')

    return {
      getHome: getHome,
      login: login,
      signup: signup,
      signout: signout,
      moviesPage: moviesPage,
      movieHandler: handleRequest(movieHandler),
      getMovies: handleRequest(getMovies),
      getMoviesByName: handleRequest(getMoviesByName),
      getMovie: handleRequest(getMovie),
      getGroups: handleRequest(getGroups),
      getGroup: handleRequest(getGroup),
      getCreateGroupPage: handleRequest(getCreateGroupPage),
      createGroup: handleRequest(createGroup),
      getEditGroupPage: handleRequest(getEditGroupPage),
      editGroup: handleRequest(editGroup),
      getDeleteGroupPage: handleRequest(getDeleteGroupPage),
      deleteGroup: handleRequest(deleteGroup),
      addMovieToGroup: handleRequest(addMovieToGroup),
      getDeleteMoviePage: handleRequest(getDeleteMoviePage),
      deleteMovieFromGroup: handleRequest(deleteMovieFromGroup),
    }

  async function getHome(req, rsp) {
    if(req.token=='') rsp.render('index.hbs')
    else{
      const user = await services.getUser(req.token)
      rsp.render('homelogin.hbs',{user})
    }
  }

  async function login(req,rsp){
    const user = await services.login(req.body.username,req.body.password)
    HAMMER_TOKEN=user.token
    rsp.render('homelogin.hbs',{user})
  }

  async function signup(req,rsp){
    const user = await services.createUser(req.body.username,req.body.password)
    HAMMER_TOKEN=user.token
    rsp.render('homelogin.hbs',{user})
  }

  async function signout(req,rsp){
    HAMMER_TOKEN=''
    rsp.render('index.hbs')
  }

  async function moviesPage(req,rsp){
    if(req.token=='') rsp.render('movies.hbs')
    else{
      const user = await services.getUser(req.token)
      rsp.render('movieslogin.hbs',{user})
    }
  }
  async function movieHandler(req,rsp){
    if(!req.query.name) rsp.redirect(`/movieSearch/movies?limit=${req.query.limit}`)
    else rsp.redirect(`/movieSearch/moviesByName?name=${req.query.name}&limit=${req.query.limit}`)
  }
  async function getMovies(req,rsp){
    const movies = await services.getMovies(req.query.limit)
    const user = await services.getUser(req.token)
    return { name: 'getMoviesPage', data: {user,movies} } 
  }
  async function getMoviesByName(req,rsp){
    const movies = await services.getMoviesByName(req.query.name,req.query.limit)
    const user = await services.getUser(req.token)
    return { name: 'getMoviesByNamePage', data: {user,movies} } 
  }
  async function getMovie(req,rsp){
    const movies = await services.getMovie(req.params.movieId)
    const user = await services.getUser(req.token)
    return { name: 'getMovie', data: {user,movies} }
  }
  async function getGroups(req,rsp){
    const user = await services.getUser(req.token)
    const groups = user.groups
    return { name: 'groups', data: {user,groups} }
  }
  async function getGroup(req,rsp){
    const group = await services.getGroupById(req.params.groupId,req.token)
    const user = await services.getUser(req.token)
    return { name: 'group', data: {user,group} }
  }
  async function getCreateGroupPage(req,rsp){
    const user = await services.getUser(req.token)
    return { name: 'createGroupPage.hbs', data: user }
  }
  async function createGroup(req,rsp){
    const group = await services.createGroup(req.body.name,req.body.description,req.token)
    const user = await services.getUser(req.token)
    return getGroups(req,rsp)
  }
  async function getEditGroupPage(req,rsp){
    const user = await services.getUser(req.token)
    return { name: 'editGroupPage.hbs', data: user }
  }
  async function editGroup(req,rsp){
    const groupId = req.body.groupId
    const newName = req.body.newName
    const newDescription = req.body.newDescription
    const group = await services.editGroup(groupId,newName,newDescription,req.token)
    const user = await services.getUser(req.token)
    return { name: 'group', data: {user,group} }
  }
  async function getDeleteGroupPage(req,rsp){
    const user = await services.getUser(req.token)
    return { name: 'deleteGroupPage.hbs', data: user }
  }
  async function deleteGroup(req,rsp){
    const group = await services.deleteGroup(req.body.groupId,req.token)
    const user = await services.getUser(req.token)
    return { name: 'groups', data: user }
  }
  async function addMovieToGroup(req,rsp){
    const groupId = req.body.groupId
    const movieId = req.body.movieId
    const group = await services.addMovieToGroup(groupId,movieId,req.token)
    return { name: 'group', data: group }
  }
  async function getDeleteMoviePage(req,rsp){
    const group = await services.getGroupById(req.params.groupId,req.token)
    return { name: 'deleteMoviePage', data: group }
  }
  async function deleteMovieFromGroup(req,rsp){
    const groupId = req.params.groupId
    const movieId = req.body.movie
    const group = await services.deleteMovieFromGroup(groupId,movieId,req.token)
    return getGroup(req,rsp)
  }

  function handleRequest(handler) {
      return async function(req, rsp) {
          req.token = HAMMER_TOKEN
          try {
            if(req.token=='') throw errors.NOT_LOGGED_IN()
            let view = await handler(req, rsp)
            const data = view.data
            if(view) {
              rsp.render(view.name, {data})
            }
          } catch(e) {
              const response = toHttpResponse(e)
              rsp.render('errorPage.hbs',{response})
          }
      }
  }
}