
import toHttpResponse from '../api/response-errors.mjs'
import errors from '../../errors.mjs'

export default function (services) {
    if(!services) throw errors.INVALID_PARAMETER('services')

    return {
      login: login,
      signup: signup
    }
      

  async function login(req,rsp){
    const username = req.body.username
    const pass = req.body.password
    try{
      const user = await services.login(username,pass)
      req.login({username: user.name, token: user.token}, ()=> rsp.redirect('/'))
    }catch(e){
      const response = toHttpResponse(e)
      rsp.render('errorPage.hbs',{response})
    }
  }

  async function signup(req,rsp){
    const username = req.body.username
    const pass = req.body.password
    try{
      const signup = await services.createUser(username,pass)
      const user = await services.login(username,pass)
      req.login({username: user.name, token: user.token}, ()=> rsp.redirect('/'))
    } catch(e){
      const response = toHttpResponse(e)
      rsp.render('errorPage.hbs',{response})
    }
  }
}