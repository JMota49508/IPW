

export default {
    INVALID_PARAMETER: argName => {
        return{
            code: 1,
            message: `Invalid argument for ${argName}`
        }
    },
    GROUP_NOT_FOUND: groupId => {
        return{
            code:3,
            message:`There isn't a group with the Id:${groupId}`
        }
    },
    USER_NOT_FOUND: () => {
        return{
            code:3,
            message:`User not found`
        }
    },
    MOVIE_NOT_FOUND: movId => {
        return{
            code:3,
            message:`There isn't a movie with the Id:${movId}`
        }
    },
    MOVIE_NOT_PRESENT: () => {
        return{
            code: 1,
            message: `That movie isn't in this group`
        }
    },
    ALREADY_ADDED: () => {
        return{
            code: 1,
            message: `That movie was already added to this group`
        }
    },
    SAME_NAME: () => {
        return{
            code: 1,
            message: `There is a group with that name already`
        }
    },
    NOT_LOGGED_IN: () => {
        return{
            code: 2,
            message: `Please login or sign up before using the features of the API`
        }
    }
}