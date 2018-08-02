const {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} = require('graphql-tools');
const { readFileSync } = require('fs');
const { join } = require('path');

// read the schema file for the definitions
const schemaString = readFileSync(join(__dirname, 'schema.graphql'), { encoding: 'utf-8' });

// pass the definitions to graphql-tools to make it executable
const schema = makeExecutableSchema({
  typeDefs: schemaString,
  // we hide this for mocking only
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
  // we must help GraphQL resolve interfaces, to do this you simply need to branch against
  // what makes each implementation of an interface different from another
  resolvers: {
    Orderable: {
      __resolveType: (obj) => {
        // in our case, a drink has an ageRestriction
        if (obj.hasOwnProperty('ageRestriction')) {
          return 'Drink';
        } else {
          return 'Food';
        }
      }
    }
  }
});

const ingredients = {
  cheese: {
    name: 'Cheese',
    restriction: 'VEGETARIAN',
    allergens: ['MILK']
  },
  dough: {
    name: 'Pizza Dough',
    restriction: 'VEGETARIAN',
    allergens: ['WHEAT']
  },
  tomato: {
    name: 'Tomato sauce',
    restriction: null,
    allergens: null,
  },
  strawberry: {
    name: 'Strawberry',
    restriction: null,
    allergens: null,
  },
  rum: {
    name: 'Rum',
    restriction: null,
    allergens: null
  }
}

const foods = {
  pizza: {
    name: 'Pepperoni Pizza',
    description: 'It\'s a pizza!',
    price: 19.99,
    ingredients: [ingredients.cheese, ingredients.dough, ingredients.tomato]
  }
}

const drinks = {
  water: {
    name: 'Water',
    description: 'Watery!',
    price: 2.99,
    ingredients: [],
    ageRestriction: false
  },
  beer: {
    name: 'Beer',
    description: 'Hoppy!',
    price: 4.95,
    ageRestriction: true,
    ingredients: [],
  },
  daiquiri: {
    name: 'Strawberry Daiquiri',
    description: 'It\'s tasty!',
    price: 8.95,
    ageRestriction: true,
    ingredients: [ingredients.strawberry, ingredients.rum]
  }
}

addMockFunctionsToSchema({
  // we want to keep our resolver map for our interface types
  preserveResolvers: true,
  schema,
  // each key in this object represents a type that you can mock a generic resposne for
  mocks: {
    Query: () => {
      // convert to array
      const foodList = Object.keys(foods).map((key) => foods[key]);
      const drinkList = Object.keys(drinks).map((key) => drinks[key]);
      return {
        food: foodList,
        drink: drinkList,
        search: (_, { name }) => {
          const orderables = [
            ...foodList,
            ...drinkList,
          ]
          // search logic here 
          return orderables;
        }
      };
    },
    Mutation: () => ({}),
  }
})

module.exports = schema
