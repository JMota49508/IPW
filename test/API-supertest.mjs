//npm install supertest --save-dev

import request from 'supertest'
import express from 'express'
import { assert,expect } from 'chai';

import data from '../cmdb-data-mem.mjs'
import servicesInit from '../cmdb-services-mem.mjs'
import webapiInit from '../cmdb-web-api-test.mjs'

const services = servicesInit(data.dataMovies,data.dataUsers)
const webapi = webapiInit(services)
let user=data.users[0]
const token = user.token

const app = express()

app.use(express.json())

app.get("/profile",webapi.profile)
app.post("/user",webapi.createUser)

app.get("/movie",webapi.getMovies)
app.get("/getMovie",webapi.getMoviesByName)
app.get("/getMovie/:movieId",webapi.getMovie)

app.get("/group", webapi.getGroups)
app.get("/group/:groupId", webapi.getGroupById)
app.post("/group",webapi.createGroup)
app.put("/group/:groupId",webapi.editGroup)
app.delete("/group/:groupId",webapi.deleteGroup)
app.put("/group/:groupId/movie",webapi.addMovieToGroup)
app.delete("/group/:groupId/movie",webapi.deleteMovieFromGroup)

describe('Users Tests API', ()=>{
    it('Get User Profile in API', () => {
        return request(app)
            .get('/profile')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(rsp=>expect(rsp.body).deep.equal(
                { id: 1, name:"João Mota", password:"G10-IPW1",token: "1c884cbc-204f-4dc7-9b37-0555275ea3e7",nextGroupId:1,groups:[] }))
    })
    it('Create User in API', () => {
        return request(app)
            .post('/user')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({username:"António Silva",password:"testpassword"})
            .expect(201)
            .then(rsp=>{
                assert.isTrue(rsp.body.id > 2)
                assert.isTrue(rsp.body.name == "António Silva")
                assert.isTrue(rsp.body.password == "testpassword")
                assert.isTrue(rsp.body.token.length > 0)
            })
    })
})

describe('Movie Tests API', ()=>{
    it('Get Movies in API Without Limit', () => {
        return request(app)
            .get('/movie')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .then(rsp=> expect(rsp.body).deep.equal([
                { "id" : 1, "title" : "The Shawshank Redemption", "duration" : 144 },
                { "id" : 2, "title" : "The Godfather", "duration" : 175 },
                { "id" : 3, "title" : "The Dark Knight", "duration" : 152 },
                { "id" : 4, "title" : "The Godfather Part II", "duration" : 202 },
                { "id" : 5, "title" : "12 Angry Men", "duration" : 96 },
                { "id" : 6, "title" : "Schindler's List", "duration" : 195 },
                { "id" : 7, "title" : "The Lord of the Rings: The Return of the King", "duration" : 201 },
                { "id" : 8, "title" : "Pulp Fiction", "duration" : 154 },
                { "id" : 9, "title" : "The Lord of the Rings: The Fellowship of the Ring", "duration" : 178 },
                { "id" : 10, "title" : "Il buono, il brutto, il cattivo", "duration" : 161 }
            ]))
    })
    it('Get Movies in API With Limit', () => {
        return request(app)
            .get('/movie')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({limit: 2})
            .expect(200)
            .then(rsp=> expect(rsp.body).deep.equal([
                { "id" : 1, "title" : "The Shawshank Redemption", "duration" : 144 },
                { "id" : 2, "title" : "The Godfather", "duration" : 175 }
            ]))
    })
    it('Get Movies By Name in API Without Limit', () => {
        return request(app)
            .get('/getMovie')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({q:"Godfather"})
            .expect(200)
            .then(rsp=> expect(rsp.body).deep.equal([
                { "id" : 2, "title" : "The Godfather", "duration" : 175 },
                { "id" : 4, "title" : "The Godfather Part II", "duration" : 202 }
            ]))
    })
    it('Get Movies By Name in API With Limit', () => {
        return request(app)
            .get('/getMovie')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({q:"Godfather",limit: 1})
            .expect(200)
            .then(rsp=> expect(rsp.body).deep.equal([
                { "id" : 2, "title" : "The Godfather", "duration" : 175 }
            ]))
    })
    it('Get Movie By Id', () => {
        return request(app)
            .get('/getMovie/2')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(rsp=> expect(rsp.body).deep.equal(
                { "id" : 2, "title" : "The Godfather", "duration" : 175 }
            ))
    })
})

describe('Group Tests API', ()=>{
    it('Create Group in API', () => {
        return request(app)
            .post('/group')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({name:"test1",description:"group test1"})
            .expect(201)
            .then(rsp=> expect(rsp.body).deep.equal({
                id:1,
                name:"test1",
                description:"group test1",
                movies: [],
                totalDuration:0 }))
    })
    it('Get Groups in API', () => {
        return request(app)
            .get('/group')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(rsp=> expect(rsp.body).deep.equal([{
                id:1,
                name:"test1",
                description:"group test1",
                movies: [],
                totalDuration:0 }]))
    })
    it('Get Group By Id in API', () => {
        return request(app)
            .get('/group/1')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(rsp=> expect(rsp.body).deep.equal({
                id:1,
                name:"test1",
                description:"group test1",
                movies: [],
                totalDuration:0 }))
    })
    it('Edit Group in API', () => {
        return request(app)
            .put('/group/1')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({newName:"testedit",newDescription:"group testedit"})
            .expect(202)
            .then(rsp=> expect(rsp.body).deep.equal({
                id:1,
                name:"testedit",
                description:"group testedit",
                movies: [],
                totalDuration:0 }))
    })
    it('Add Movie To Group in API', () => {
        return request(app)
            .put('/group/1/movie')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({movieId:"1"})
            .expect(202)
            .then(rsp=> expect(rsp.body).deep.equal({
                id:1,
                name:"testedit",
                description:"group testedit",
                movies: [{
                    id : 1,
                    title : "The Shawshank Redemption",
                    duration :144}],
                totalDuration:144}))
    })
    it('Delete Movie From Group in API', () => {
        return request(app)
            .delete('/group/1/movie')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({movieId:"1"})
            .expect(202)
            .then(rsp=> expect(rsp.body).deep.equal({
                id:1,
                name:"testedit",
                description:"group testedit",
                movies: [],
                totalDuration:0}))
    })
    it('Delete Group in API', () => {
        return request(app)
            .delete('/group/1')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(202)
            .then(rsp=> expect(rsp.body).deep.equal([]))
    })
})
