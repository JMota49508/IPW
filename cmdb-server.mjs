import express from 'express'
import movieData from './cmdb-movies-data.mjs'
import userData from './data-elastic.mjs'
import servicesInit from './cmdb-services-api.mjs'
import webapiInit from './cmdb-web-api.mjs'
import siteInit from './web/site/tasks-http-site.mjs'
import cors from 'cors'
import yaml from 'yamljs'
import swaggerUi from 'swagger-ui-express'
import hbs from 'hbs'
import url from 'url'
import path from 'path'

const swaggerDocument = yaml.load('./api.yaml')
const Port = 8080
console.log("Start setting up server")
const app = express()

const services = servicesInit(movieData,userData)
const webapi = webapiInit(services)
const site = siteInit(services)

app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'web', 'site', 'views'));

app.use(express.static('public'));

app.get('/', site.getHome)
app.post('/login',site.login)
app.get('/signout',site.signout)
app.post('/signup',site.signup)
app.get('/movieSearch',site.moviesPage)
app.get('/movieHandler',site.movieHandler)
app.get('/movieSearch/movies',site.getMovies)
app.get('/movieSearch/moviesByName',site.getMoviesByName)
app.get('/movie/:movieId',site.getMovie)
app.get('/groups',site.getGroups)
app.get('/group',site.getCreateGroupPage)
app.get('/group/:groupId',site.getGroup)
app.post('/createGroup',site.createGroup)
app.post('/editGroupInternal',site.editGroup)
app.get('/editGroup',site.getEditGroupPage)
app.post('/deleteGroupInternal',site.deleteGroup)
app.get('/deleteGroup',site.getDeleteGroupPage)
app.post('/addMovieToGroup',site.addMovieToGroup)
app.get('/deleteMoviePage/:groupId',site.getDeleteMoviePage)
app.post('/deleteMovieFromGroup/:groupId',site.deleteMovieFromGroup)

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.get("/movieapi",webapi.getMovies)
app.get("/getMovie",webapi.getMoviesByName)

app.post("/user",webapi.createUser)
app.get("/user",webapi.getUsers)

app.post("/group",webapi.createGroup)
app.get("/group", webapi.getGroups)
app.get("/group/:groupId", webapi.getGroupById)
app.put("/group/:groupId",webapi.editGroup)
app.delete("/group/:groupId",webapi.deleteGroup)
app.put("/group/:groupId/movie",webapi.addMovieToGroup)
app.delete("/group/:groupId/movie",webapi.deleteMovieFromGroup)

app.listen(Port, ()=>console.log("Listening on PORT:" + Port))
