import express from 'express'
import movieData from './cmdb-movies-data.mjs'
import userData from './data-elastic.mjs'
import servicesInit from './cmdb-services-api.mjs'
import webapiInit from './cmdb-web-api.mjs'
import siteInit from './web/site/http-site.mjs'
import siteAuthInit from './web/site/http-auth.mjs'
import cors from 'cors'
import yaml from 'yamljs'
import swaggerUi from 'swagger-ui-express'
import hbs from 'hbs'
import url from 'url'
import path from 'path'
import passport from 'passport'
import expressSession from 'express-session'

const swaggerDocument = yaml.load('./api.yaml')
const Port = 8080
console.log("Start setting up server")

const app = express()
const services = servicesInit(movieData,userData)
const webapi = webapiInit(services)
const authSite = siteAuthInit(services)
const site = siteInit(services)
function authorizationMw(req, rsp, next) {
  console.log('authorizationMw', req.get('Authorization'))
  if(req.get('Authorization')){
          req.user = {
          token: req.get('Authorization').split(' ')[1]
      }
  }
  next()
}
app.use(expressSession({
  secret: "IPW API",
  resave: false,
  saveUninitialized: false
}
))
app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Passport initialization
app.use(passport.session())
app.use(passport.initialize())

passport.serializeUser((user, done) => done(null, user)) 
passport.deserializeUser((user, done) => done(null, user))

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'web', 'site', 'views'));

app.use(express.static('public'))
app.use("/api",authorizationMw)

//Public routes
app.get('/', site.getHome)
app.post('/login',authSite.login)
app.post('/signup',authSite.signup)

//Login needed routes
app.get('/signout',site.signout)
app.get('/profile',site.profile)
app.post('/deleteUser',site.deleteUser)
app.get('/movieSearch',site.moviesPage)
app.get('/movieHandler',site.movieHandler)
app.get('/movieSearch/movies',site.getMovies)
app.get('/movieSearch/moviesByName',site.getMoviesByName)
app.get('/movie/:movieId',site.getMovie)
app.get('/groups',site.getGroups)
app.get('/group',site.getCreateGroupPage)
app.get('/group/:groupId',site.getGroup)
app.post('/createGroup',site.createGroup)
app.get('/editGroup',site.getEditGroupPage)
app.get('/deleteGroup',site.getDeleteGroupPage)
app.get('/deleteMoviePage/:groupId',site.getDeleteMoviePage)

//Authenticated Routes
app.put("/api/editGroup",webapi.editGroup)
app.delete("/api/group/:groupId",webapi.deleteGroup)
app.put("/api/group/:groupId/:movieId",webapi.addMovieToGroup)
app.delete("/api/group/:groupId/:movieId",webapi.deleteMovieFromGroup)

app.listen(Port, ()=>console.log("Listening on PORT:" + Port))
