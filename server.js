const express = require('express')
const schema = require('./schema/schema')

const expressGraphQL = require('express-graphql')

const app = express();

app.use('/graphql', expressGraphQL({
    schema, 
    graphiql: true
}))


app.listen(4000, ()=> {
    console.log('listening')
});