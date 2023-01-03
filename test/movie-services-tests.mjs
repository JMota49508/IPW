
import { assert,expect } from 'chai'
import data from '../cmdb-data-mem.mjs'
import servicesInit from '../cmdb-services-mem.mjs'

const services = servicesInit(data.dataMovies,data.dataUsers)
describe('Movie Tests', ()=>{
    it('Get Movies without limit', () => {
            return services.getMovies()
                .then(result => expect(result).deep.equal([
                    { "id" : 1, "title" : "The Shawshank Redemption", "duration" :144 },
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
    it('Get Movies with limit', () => {
            return services.getMovies(6)
                .then(result => expect(result).deep.equal([
                    { "id" : 1, "title" : "The Shawshank Redemption", "duration" :144 },
                    { "id" : 2, "title" : "The Godfather", "duration" : 175 },
                    { "id" : 3, "title" : "The Dark Knight", "duration" : 152 },
                    { "id" : 4, "title" : "The Godfather Part II", "duration" : 202 },
                    { "id" : 5, "title" : "12 Angry Men", "duration" : 96 },
                    { "id" : 6, "title" : "Schindler's List", "duration" : 195 }
                ]))
                .then(services.getMovies(4)
                    .then(result => expect(result).deep.equal([
                        { "id" : 1, "title" : "The Shawshank Redemption", "duration" :144 },
                        { "id" : 2, "title" : "The Godfather", "duration" : 175 },
                        { "id" : 3, "title" : "The Dark Knight", "duration" : 152 },
                        { "id" : 4, "title" : "The Godfather Part II", "duration" : 202 }
                    ])))
    })
    it('Get Movies by name without limit', () => {
            return services.getMoviesByName("The")
                .then(result => expect(result).deep.equal([
                    { "id" : 1, "title" : "The Shawshank Redemption", "duration" :144 },
                    { "id" : 2, "title" : "The Godfather", "duration" : 175 },
                    { "id" : 3, "title" : "The Dark Knight", "duration" : 152 },
                    { "id" : 4, "title" : "The Godfather Part II", "duration" : 202 },
                    { "id" : 7, "title" : "The Lord of the Rings: The Return of the King", "duration" : 201 },
                    { "id" : 9, "title" : "The Lord of the Rings: The Fellowship of the Ring", "duration" : 178 },
                ]))
                .then(services.getMoviesByName("Il")
                    .then(result => expect(result).deep.equal([
                        { "id" : 10, "title" : "Il buono, il brutto, il cattivo", "duration" : 161 }
                    ])))
                .then(services.getMoviesByName("a")
                    .then(result => expect(result).deep.equal([
                        { "id" : 1, "title" : "The Shawshank Redemption", "duration" :144 },
                        { "id" : 2, "title" : "The Godfather", "duration" : 175 },
                        { "id" : 3, "title" : "The Dark Knight", "duration" : 152 },
                        { "id" : 4, "title" : "The Godfather Part II", "duration" : 202 },
                        { "id" : 5, "title" : "12 Angry Men", "duration" : 96 },
                    ])))
                .then(services.getMoviesByName("o")
                    .then(result => expect(result).deep.equal([
                        { "id" : 1, "title" : "The Shawshank Redemption", "duration" :144 },
                        { "id" : 2, "title" : "The Godfather", "duration" : 175 },
                        { "id" : 4, "title" : "The Godfather Part II", "duration" : 202 },
                        { "id" : 7, "title" : "The Lord of the Rings: The Return of the King", "duration" : 201 },
                        { "id" : 8, "title" : "Pulp Fiction", "duration" : 154 },
                        { "id" : 9, "title" : "The Lord of the Rings: The Fellowship of the Ring", "duration" : 178 },
                        { "id" : 10, "title" : "Il buono, il brutto, il cattivo", "duration" : 161 }
                    ])))
    })
    it('Get Movies by name with limit', () => {
            return services.getMoviesByName("The",5)
                .then(result => expect(result).deep.equal([
                    { "id" : 1, "title" : "The Shawshank Redemption", "duration" :144 },
                    { "id" : 2, "title" : "The Godfather", "duration" : 175 },
                    { "id" : 3, "title" : "The Dark Knight", "duration" : 152 },
                    { "id" : 4, "title" : "The Godfather Part II", "duration" : 202 },
                    { "id" : 7, "title" : "The Lord of the Rings: The Return of the King", "duration" : 201 },
                ]))
            .then(services.getMoviesByName("a",2)
                .then(result => expect(result).deep.equal([
                    { "id" : 1, "title" : "The Shawshank Redemption", "duration" :144 },
                    { "id" : 2, "title" : "The Godfather", "duration" : 175 }
                ])))
            .then(services.getMoviesByName("o",4)
                .then(result => expect(result).deep.equal([
                    { "id" : 1, "title" : "The Shawshank Redemption", "duration" :144 },
                    { "id" : 2, "title" : "The Godfather", "duration" : 175 },
                    { "id" : 4, "title" : "The Godfather Part II", "duration" : 202 },
                    { "id" : 7, "title" : "The Lord of the Rings: The Return of the King", "duration" : 201 }
                ])))
    })
})