const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull
} = require('graphql');

const DocumentType = new GraphQLObjectType({
    name: 'Document',
    description: 'This represents a document',
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLString },
        text: { type: GraphQLString },
        userId: { type: GraphQLString },
        shared: { type: new GraphQLList(GraphQLString) }
    })
});

module.exports = DocumentType;