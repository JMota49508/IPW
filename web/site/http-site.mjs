// Module that contains the functions that handle all HTTP APi requests.
// Handle HTTP request means:
//  - Obtain data from requests. Request data can be obtained from: URI(path, query, fragment), headers, body
//  - Invoke the corresponding operation on services
//  - Generate the response in HTML format

import errors from '../../errors.mjs';
import toHttpResponse from '../api/response-errors.mjs'

export default function (services) {
    if(!services) throw errors.INVALID_PARAMETER('services')

    return {
      getHome: getHome,
      signout: signout,
      deleteUser: deleteUser,
      moviesPage: moviesPage,
      profile: handleRequest(profile),
      movieHandler: handleRequestFunctions(movieHandler),
      getMovies: handleRequest(getMovies),
      getMoviesByName: handleRequest(getMoviesByName),
      getMovie: handleRequest(getMovie),
      getGroups: handleRequest(getGroups),
      getGroup: handleRequest(getGroup),
      getCreateGroupPage: handleRequest(getCreateGroupPage),
      createGroup: handleRequestFunctions(createGroup),
      getEditGroupPage: handleRequest(getEditGroupPage),
      editGroup: handleRequestFunctions(editGroup),
      getDeleteGroupPage: handleRequest(getDeleteGroupPage),
      deleteGroup: handleRequestFunctions(deleteGroup),
      addMovieToGroup: handleRequestFunctions(addMovieToGroup),
      getDeleteMoviePage: handleRequest(getDeleteMoviePage),
      deleteMovieFromGroup: handleRequestFunctions(deleteMovieFromGroup),
    }

  async function getHome(req, rsp) {
    if(!req.user) rsp.render('index.hbs')
    else{
      const user = await services.getUser(req.user.token)
      rsp.render('homelogin.hbs',{user})
    }
  }

  async function deleteUser(req,rsp){
    const token = req.user.token
    const user = await services.deleteUser(token)
    req.logout(()=> rsp.redirect('/'))
  }

  async function profile(req,rsp){
    const token = req.user.token
    const user = await services.getUser(token)
    if(!user) throw errors.USER_NOT_FOUND()
    return { name: 'profile', data: {user} }
  }

  async function signout(req,rsp){
    req.logout(()=>rsp.redirect('/'))
  }

  async function moviesPage(req,rsp){
    if(!req.user.token) rsp.render('movies.hbs')
    else{
      const user = await services.getUser(req.user.token)
      rsp.render('movieslogin.hbs',{user})
    }
  }
  async function movieHandler(req,rsp){
    if(!req.query.name) return `/movieSearch/movies?limit=${req.query.limit}`
    else return `/movieSearch/moviesByName?name=${req.query.name}&limit=${req.query.limit}`
  }
  async function getMovies(req,rsp){
    const movies = await services.getMovies(req.query.limit)
    const user = await services.getUser(req.user.token)
    return { name: 'getMoviesPage', data: {user,movies} } 
  }
  async function getMoviesByName(req,rsp){
    const movies = await services.getMoviesByName(req.query.name,req.query.limit)
    const user = await services.getUser(req.user.token)
    return { name: 'getMoviesByNamePage', data: {user,movies} } 
  }
  async function getMovie(req,rsp){
    const movies = await services.getMovie(req.params.movieId)
    const user = await services.getUser(req.user.token)
    return { name: 'getMovie', data: {user,movies} }
  }
  async function getGroups(req,rsp){
    const user = await services.getUser(req.user.token)
    const groups = user.groups
    return { name: 'groups', data: {user,groups} }
  }
  async function getGroup(req,rsp){
    const group = await services.getGroupById(req.params.groupId,req.user.token)
    const user = await services.getUser(req.user.token)
    return { name: 'group', data: {user,group} }
  }
  async function getCreateGroupPage(req,rsp){
    const user = await services.getUser(req.user.token)
    return { name: 'createGroupPage.hbs', data: user }
  }
  async function createGroup(req,rsp){
    const group = await services.createGroup(req.body.name,req.body.description,req.user.token)
    const user = await services.getUser(req.user.token)
    return `/groups`
  }
  async function getEditGroupPage(req,rsp){
    const user = await services.getUser(req.user.token)
    return { name: 'editGroupPage.hbs', data: user }
  }
  async function editGroup(req,rsp){
    const groupId = req.body.groupId
    const newName = req.body.newName
    const newDescription = req.body.newDescription
    const group = await services.editGroup(groupId,newName,newDescription,req.user.token)
    const user = await services.getUser(req.user.token)
    return `/group/${groupId}`
  }
  async function getDeleteGroupPage(req,rsp){
    const user = await services.getUser(req.user.token)
    return { name: 'deleteGroupPage.hbs', data: user }
  }
  async function deleteGroup(req,rsp){
    const group = await services.deleteGroup(req.body.groupId,req.user.token)
    const user = await services.getUser(req.user.token)
    return `/groups`
  }
  async function addMovieToGroup(req,rsp){
    const groupId = req.body.groupId
    const movieId = req.body.movieId
    const group = await services.addMovieToGroup(groupId,movieId,req.user.token)
    return `/group/${groupId}`
  }
  async function getDeleteMoviePage(req,rsp){
    const group = await services.getGroupById(req.params.groupId,req.user.token)
    const user = await services.getUser(req.user.token)
    return { name: 'deleteMoviePage', data: {group,user} }
  }
  async function deleteMovieFromGroup(req,rsp){
    const groupId = req.params.groupId
    const movieId = req.body.movie
    const group = await services.deleteMovieFromGroup(groupId,movieId,req.user.token)
    return `/group/${groupId}`
  }

  function handleRequest(handler) {
      return async function(req, rsp) {
          try {
            if(!req.user.token) throw errors.NOT_LOGGED_IN()
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
  function handleRequestFunctions(handler) {
    return async function(req, rsp) {
        try {
          if(!req.user.token) throw errors.NOT_LOGGED_IN()
          let view = await handler(req, rsp)
          rsp.redirect(view)
        } catch(e) {
            const response = toHttpResponse(e)
            rsp.render('errorPage.hbs',{response})
        }
    }
}
}