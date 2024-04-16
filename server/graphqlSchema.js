const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLEnumType,
} = require("graphql");
const Client = require("./models/Client");
const Project = require("./models/Project");

const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  },
});

const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId);
      },
    },
  },
});

const query = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    client: {
      type: ClientType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Client.findById(args.id);
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve() {
        return Client.find();
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve() {
        return Project.find();
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Project.findById(args.id);
      },
    },
    projectsByClientId: {
      type: new GraphQLList(ProjectType),
      args: { clientId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Project.find({ clientId: args.clientId });
      },
    },
    // projectsByStatus: {
    //   type: new GraphQLList(ProjectType),
    //   args: {status:{type: }}
    // }
  },
});

const ClientInputType = new GraphQLInputObjectType({
  name: "ClientInput",
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    phone: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const ProjectInputType = new GraphQLInputObjectType({
  name: "ProjectInput",
  fields: () => ({
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: {
      type: new GraphQLEnumType({
        name: "ProjectStatus",
        values: {
          new: { value: "Not Started" },
          progress: { value: "In Progress" },
          completed: { value: "Completed" },
        },
      }),
      defaultValue: "Not Started",
    },
    clientId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

const mutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    addClient: {
      type: ClientType,
      args: {
        input: { type: new GraphQLNonNull(ClientInputType) },
      },
      resolve(parent, args) {
        const client = new Client({ ...args.input });

        return client.save();
      },
    },
    updateClient: {
      type: ClientType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: {
          type: ClientInputType,
        },
      },
      resolve(parent, args) {
        const updateClientInput = { ...args.input };

        const updatedClient = Client.findByIdAndUpdate(
          args.id,
          updateClientInput,
          {
            new: true,
          }
        );

        if (!updatedClient) {
          throw new Error("Client not found");
        }

        return updatedClient;
      },
    },
    deleteClient: {
      type: ClientType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Client.findByIdAndRemove(args.id);
      },
    },
    addProject: {
      type: ProjectType,
      args: {
        input: { type: new GraphQLNonNull(ProjectInputType) },
      },
      resolve(parent, args) {
        const project = new Project({ ...args.input });

        return project.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query,
  mutation,
});
