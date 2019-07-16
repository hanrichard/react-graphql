const graphql = require('graphql');
const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull,
} = graphql



const UserType = new GraphQLObjectType({
  name: 'User',
  fields: ()=>({
      id: {type: GraphQLString},
      firstname: {type: GraphQLString},
      age: {type: GraphQLInt },
      company: {
        type: CompanyType,
        resolve(parenetValue, args) {
            return axios.get(`http://localhost:3000/companies/${parenetValue.companyId}`)
               .then(response => response.data)
        }
      }
  })  
})

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: ()=>({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parenetValue, args) {
                return axios.get(`http://localhost:3000/companies/${parenetValue.id}/users`)
                   .then(response => response.data)
            }
        }
    }) 
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {
                id: { type: GraphQLString}
            },
            resolve( parenetValue, args) {
               return axios.get(`http://localhost:3000/users/${args.id}`)
               .then(response => response.data)
            }
        },

        company: {
            type: CompanyType,
            args: {
                id: { type: GraphQLString}
            },
            resolve( parenetValue, args) {
               return axios.get(`http://localhost:3000/companies/${args.id}`)
               .then(response => response.data)
            }
        }
    }
})



const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstname: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLNonNull(GraphQLInt)},
                companyId: {type: GraphQLString}
            },
            resolve(parenetValue, {firstname, age, companyId}) {
                return axios.post(`http://localhost:3000/users/`, { firstname, age, companyId}).then(res=>res.data)
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parenetValue, args) {
                return axios.delete(`http://localhost:3000/users/${args.id}`).then(res=>res.data)
            }
        },
        editUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                firstname: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLNonNull(GraphQLInt)},
                companyId: {type: GraphQLString}
            },
            resolve(parenetValue, {id, firstname, age, companyId}) {
                return axios.patch(`http://localhost:3000/users/${id}`, {firstname, age, companyId}).then(res=>res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})