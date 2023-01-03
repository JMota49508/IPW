
import { assert,expect } from 'chai'
import data from '../cmdb-data-mem.mjs'
import servicesInit from '../cmdb-services-mem.mjs'

const services = servicesInit(data.dataMovies,data.dataUsers)
describe('User Tests', ()=>{
    it('Get Users', () => {
            services.getUsers()
                .then(result => expect(result).deep.equal([
                    { id: 1, name:"João Mota", password:"G10-IPW1",token: "1c884cbc-204f-4dc7-9b37-0555275ea3e7",nextGroupId:1,groups:[] },
                    { id: 2, name:"Gonçalo Pinto", password:"G10-IPW2",token: "bf4f490b-a408-4b29-a033-6aa6d4364e92",nextGroupId:1,groups:[] },
                    { id: 3, name:"Frederico Cerqueira", password:"G10-IPW3",token: "0263bfee-7a78-41b4-9fbf-c8daa87a590a",nextGroupId:1,groups:[] }
                ]))
    })
    it('Create User', () => {
        return services.createUser("Manuel", "12345")
                .then(result => {
                    assert.isTrue(result.id > 3)
                    assert.isTrue(result.name == "Manuel")
                    assert.isTrue(result.token.length > 0)
                })
                .then(assert.isTrue(data.users.length > 3))
                .then(data.users.splice(data.users.length - 1, 1))
                .then(services.getUsers()
                    .then(result => expect(result).deep.equal([
                        { id: 1, name:"João Mota", password:"G10-IPW1",token: "1c884cbc-204f-4dc7-9b37-0555275ea3e7",nextGroupId:1,groups:[] },
                        { id: 2, name:"Gonçalo Pinto", password:"G10-IPW2",token: "bf4f490b-a408-4b29-a033-6aa6d4364e92",nextGroupId:1,groups:[] },
                        { id: 3, name:"Frederico Cerqueira", password:"G10-IPW3",token: "0263bfee-7a78-41b4-9fbf-c8daa87a590a",nextGroupId:1,groups:[] }
                    ])))
    })
    it('Fail to Create User(Password undefined)', () => {
        return services.createUser("Manuel",undefined)
                .catch(result =>{
                    assert.isTrue(result.code == 1)
                    assert.isTrue(result.message == "Invalid argument for password")
                })
                .then(services.getUsers()
                    .then(result => expect(result).deep.equal([
                        { id: 1, name:"João Mota", password:"G10-IPW1",token: "1c884cbc-204f-4dc7-9b37-0555275ea3e7",nextGroupId:1,groups:[] },
                        { id: 2, name:"Gonçalo Pinto", password:"G10-IPW2",token: "bf4f490b-a408-4b29-a033-6aa6d4364e92",nextGroupId:1,groups:[] },
                        { id: 3, name:"Frederico Cerqueira", password:"G10-IPW3",token: "0263bfee-7a78-41b4-9fbf-c8daa87a590a",nextGroupId:1,groups:[] }
                    ])))
    })
    it('Fail to Create User(Username undefined)', () => {
        return services.createUser(undefined,"12345")
            .catch(result =>{
                assert.isTrue(result.code == 1)
                assert.isTrue(result.message == "Invalid argument for username")
            })
            .then(services.getUsers()
                    .then(result => expect(result).deep.equal([
                        { id: 1, name:"João Mota", password:"G10-IPW1",token: "1c884cbc-204f-4dc7-9b37-0555275ea3e7",nextGroupId:1,groups:[] },
                        { id: 2, name:"Gonçalo Pinto", password:"G10-IPW2",token: "bf4f490b-a408-4b29-a033-6aa6d4364e92",nextGroupId:1,groups:[] },
                        { id: 3, name:"Frederico Cerqueira", password:"G10-IPW3",token: "0263bfee-7a78-41b4-9fbf-c8daa87a590a",nextGroupId:1,groups:[] }
                    ])))
    })
})