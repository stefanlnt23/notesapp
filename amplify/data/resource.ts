import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Project: a.model({
    id: a.id(),
    title: a.string(),
    description: a.string(),
    technologies: a.array(a.string()),
    liveUrl: a.string().optional(),
    githubUrl: a.string().optional(),
    isFeatured: a.boolean().default(false),
    createdAt: a.datetime(),
    updatedAt: a.datetime()
  }).authorization([
    a.allow.public().to(['read']),
    a.allow.owner().to(['create', 'update', 'delete'])
  ]),

  Service: a.model({
    id: a.id(),
    title: a.string(),
    description: a.string(),
    features: a.array(a.string()),
    technologies: a.array(a.string()),
    orderIndex: a.integer(),
    isActive: a.boolean().default(true),
    createdAt: a.datetime(),
    updatedAt: a.datetime()
  }).authorization([
    a.allow.public().to(['read']),
    a.allow.owner().to(['create', 'update', 'delete'])
  ]),

  Contact: a.model({
    id: a.id(),
    name: a.string(),
    email: a.string(),
    message: a.string(),
    status: a.string(),
    createdAt: a.datetime(),
    updatedAt: a.datetime()
  }).authorization([
    a.allow.public().to(['create']),
    a.allow.owner().to(['read', 'update', 'delete'])
  ])
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({ schema });
