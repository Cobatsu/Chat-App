const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const app = express();
const { buildSchema } = require('graphql');

app.get('/', (req, res) => {
    res.send('An alligator approaches!');
});

const apples = []

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
    
    type Query {

        getMyApple(id:String) : String

    }

    type Mutation {

        addMyApple(id:String) : String

    }

    schema {
        query: Query
        mutation: Mutation
    }

    `),
    rootValue:{

        getMyApple: args => { const apples1 = apples.filter((value)=> value.id == args.id); return apples1[0].id } ,
        addMyApple: args => { apples.push({id:args.id}); return args.id}

    },
    graphiql: true,
  }),
);

app.listen(3000, () => console.log('Gator app listening on port 3000!'));
