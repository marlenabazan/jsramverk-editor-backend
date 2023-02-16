const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
} = require('graphql');

const DocumentType = require('./documents.js');

const documents = require('../models/documents.js');

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        document: {
            type: DocumentType,
            description: 'A single document',
            args: {
                id: { type: GraphQLString }
            },
            resolve: async function(parent, args) {
                const document = await documents.getOneDocument(args.id);
                return document;
            }
        },
        documents: {
            type: new GraphQLList(DocumentType),
            description: 'List of all documents',
            resolve: async function() {
                const allDocuments = await documents.getAllDocuments();
                return allDocuments;
            }
        }
    })
});

module.exports = RootQueryType;