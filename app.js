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
    
    type Apple {
        color: String!
        price: String!
    }

    type Query {

        getMyApple(color:String!) : [Apple]

    }

    type Mutation {

        addMyApple(color:String!, price:Float!) : Apple!

    }

    schema {
        query: Query
        mutation: Mutation
    }

    `),
    rootValue:{

        getMyApple: args => { const apples1 = apples.filter((value)=> value.color == args.color); return apples1 } ,
        addMyApple: args => { const pushedApple = {color:args.color, price:args.price}; apples.push( pushedApple ); return {color:"ss"}}

    },
    graphiql: true,
  }),
);

app.listen(3000, () => console.log('Gator app listening on port 3000!'));
