
import { assert,expect } from 'chai'
import data from '../cmdb-data-mem.mjs'
import servicesInit from '../cmdb-services-mem.mjs'

const services = servicesInit(data.dataMovies,data.dataUsers)
let user=data.users[0]

describe('Group Tests', ()=>{
    it('Get Groups', () => {
        user=data.users[0]
        user.nextGroupId=1
        return services.getGroups(user.token)
                    .then(result => expect(result).deep.equal([]))
                    .then(services.createGroup("test1","test group",user.token))
                    .then(services.getGroups(user.token).then(result => expect(result).deep.equal([
                        { id:1, name:"test1" , description:"test group" , movies: [] , totalDuration:0 }
                    ])))
                    .then(services.getGroups(data.users[1].token).then(result => expect(result).deep.equal([])))
                    .then(services.deleteGroup(1,user.token))
    })
    it('Fail To Get Groups', () => {
        return services.getGroups(undefined)
                .catch(result =>{
                    assert.isTrue(result.code == 3)
                    assert.isTrue(result.message == "User not found")
                })
    })
    it('Get Group By Id', () => {
        user=data.users[0]
        user.nextGroupId=1
        services.createGroup("test1","test group",user.token)
        return services.getGroupById(1,user.token)
                    .then(result => expect(result).deep.equal(
                        { id:1, name:"test1" , description:"test group" , movies: [] , totalDuration:0 }
                    ))
                    .then(services.deleteGroup(1,user.token))
    })
    it('Fail To Get Group By Id', () => {
        user=data.users[0]
        user.nextGroupId=1
        services.createGroup("test1","test group",user.token)
        return services.getGroupById(undefined,user.token)
                .catch(result =>{
                    assert.isTrue(result.code == 1)
                    assert.isTrue(result.message == "Invalid argument for id")
                })
                .then(services.getGroupById(1,undefined)
                    .catch(result =>{
                        assert.isTrue(result.code == 3)
                        assert.isTrue(result.message == "User not found")
                    }))
                .then(services.getGroupById(7,user.token)
                    .catch(result =>{
                        assert.isTrue(result.code == 3)
                        assert.isTrue(result.message == "There isn't a group with the Id:7")
                    }))
                .then(services.deleteGroup(1,user.token))
    })
    it('Create Group', () => {
        user=data.users[0]
        user.nextGroupId=1
        return services.createGroup("test1","test group",user.token)
                .then(services.getGroups(user.token).then(result => expect(result).deep.equal([
                    { id:1, name:"test1" , description:"test group" , movies: [] , totalDuration:0 }
                ])))
                .then(services.createGroup("test2","test2 group",user.token))
                .then(services.getGroups(user.token).then(result => expect(result).deep.equal([
                    { id:1, name:"test1" , description:"test group" , movies: [] , totalDuration:0 },
                    { id:2, name:"test2" , description:"test2 group" , movies: [] , totalDuration:0 }
                ])))
                .then(services.deleteGroup(1,user.token))
                .then(services.deleteGroup(2,user.token))
    })
    it('Fail To Create Group', () => {
        user=data.users[0]
        user.nextGroupId=1
        return services.createGroup("test1","test group",undefined)
                .catch(result =>{
                assert.isTrue(result.code == 3)
                assert.isTrue(result.message == "User not found")
                })
                .then(services.createGroup(undefined,"test group",user.token).catch(result =>{
                    assert.isTrue(result.code == 1)
                    assert.isTrue(result.message == "Invalid argument for name")
                }))
    })
    it('Edit Group', () => {
        user=data.users[0]
        user.nextGroupId=1
        services.createGroup("test1","test group",user.token)
        return services.editGroup(1,"test2","test2 group",user.token)
                .then(result=>{ expect(result).deep.equal(
                    { id:1, name:"test2" , description:"test2 group" , movies: [] , totalDuration:0 }
                )
                services.editGroup(1,"test1","test group",user.token)
                    .then(result=> expect(result).deep.equal(
                        { id:1, name:"test1" , description:"test group" , movies: [] , totalDuration:0 }
                    ))})
                .then(services.deleteGroup(1,user.token))
    })
    it('Fail to Edit Group', () => {
        user=data.users[0]
        user.nextGroupId=1
        services.createGroup("test1","test group",user.token)
        return services.editGroup(1,"test2","test2 group",undefined)
                .catch(result =>{
                    assert.isTrue(result.code == 3)
                    assert.isTrue(result.message == "User not found")
                })
                .then(services.editGroup(undefined,"test2","test2 group",user.token)
                    .catch(result =>{
                        assert.isTrue(result.code == 3)
                        assert.isTrue(result.message == "Invalid argument for id")
                    }))
                .then(services.editGroup(3,"test2","test2 group",user.token)
                    .catch(result =>{
                        assert.isTrue(result.code == 3)
                        assert.isTrue(result.message == "There isn't a group with the Id:3")
                    }))
                .then(services.editGroup(1,"test","test2 group",user.token)
                    .catch(result =>{
                        assert.isTrue(result.code == 1)
                        assert.isTrue(result.message == "There is a group with that name already")
                    }))
                .then(services.deleteGroup(1,user.token))
    })
    it('Delete Group', () => {
        user=data.users[0]
        user.nextGroupId=1
        services.createGroup("test1","test group",user.token)
        services.createGroup("test2","test2 group",user.token)
        services.deleteGroup(1,user.token)
            .then(result=> expect(result).deep.equal(
                { id:2, name:"test2" , description:"test2 group" , movies: [] , totalDuration:0 }
            ))
        services.deleteGroup(2,user.token)
            .then(result=> expect(result).deep.equal([]))
    })
    it('Fail To Delete Group', () => {
        user = data.users[0]
        user.nextGroupId=1
        services.deleteGroup("test1","test group",user.token)
        services.deleteGroup(1,"test2","test2 group",undefined)
            .catch(result =>{
                assert.isTrue(result.code == 3)
                assert.isTrue(result.message == "User not found")
            })
        services.deleteGroup(undefined,"test2","test2 group",user.token)
            .catch(result =>{
                assert.isTrue(result.code == 3)
                assert.isTrue(result.message == "Invalid argument for id")
            })
        services.deleteGroup(3,"test2","test2 group",user.token)
            .catch(result =>{
                assert.isTrue(result.code == 3)
                assert.isTrue(result.message == "There isn't a group with the Id:3")
            })
    })
    it('Add Movie To Group', () => {
        user = data.users[0]
        user.nextGroupId=1
        services.getMovies()
        services.createGroup("test1","test group",user.token)
        return services.addMovieToGroup(1,1,user.token)
            .then(result=> expect(result).deep.equal(
                { id:1, name:"test1" , description:"test group" , movies:[
                    { id : 1, title : "The Shawshank Redemption", duration :144 }], totalDuration:144 }
            ))
            .then(services.deleteGroup(1,user.token))
    })
    it('Fail To Add Movie To Group',() => {

    })
    it('Delete Movie From Group', () => {
        user = data.users[0]
        user.nextGroupId=1
        services.getMovies()
        services.createGroup("test1","test group",user.token)
        services.addMovieToGroup(1,1,user.token)
        return services.deleteMovieFromGroup(1,1,user.token)
            .then(r => expect(r).deep.equal(
                { id:1, name:"test1" , description:"test group" , movies: [] , totalDuration:0 }
            ))
    })
    it('Fail To Delete Movie From Group',() => {
        
    })
})