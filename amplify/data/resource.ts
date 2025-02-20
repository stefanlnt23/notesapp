// import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// const schema = a.schema({
//   // BlogPost: a
//   //   .model({
//   //     title: a.string(),
//   //     content: a.string(),
//   //     slug: a.string(),
//   //     status: a.string(),
//   //     category: a.string(),
//   //     featuredImage: a.string(),
//   //     createdAt: a.string(),
//   //     updatedAt: a.string()
//   //   })
//   //   // .authorization((allow) => [
//   //   //   allow.public().to(['read']),
//   //   //   allow.owner().to(['create', 'update', 'delete'])
//   //   // ])
//   // ,

//   Service: a
//     .model({
//       title: a.string(),
//       description: a.string(),
//       icon: a.string(),
//       features: a.string(),
//       technologies: a.string(),
//       orderIndex: a.integer(),
//       isActive: a.boolean()
//     })
//     // .authorization((allow) => [
//     //   allow.authenticated().to(['read']),
//     //   allow.owner().to(['create', 'update', 'delete'])
//     // ])
//   ,

//   Project: a
//     .model({
//       title: a.string(),
//       description: a.string(),
//       technologies: a.string(),
//       images: a.string(),
//       liveUrl: a.string(),
//       githubUrl: a.string(),
//       isFeatured: a.boolean()
//     })
//     // .authorization((allow) => [
//     //   allow.authenticated().to(['read']),
//     //   allow.owner().to(['create', 'update', 'delete'])
//     // ])
//   ,

//   Contact: a
//     .model({
//       name: a.string(),
//       email: a.string(),
//       message: a.string(),
//       status: a.string(),
//       createdAt: a.string()
//     })
//     // .authorization((allow) => [
//     //   allow.authenticated().to(['read']),
//     //   allow.owner().to(['create', 'update', 'delete'])
//     // ])
// });

// export type Schema = ClientSchema<typeof schema>;

// export const data = defineData({
//   schema,
//   // authorizationModes: {
//   //   defaultAuthorizationMode: 'apiKey',
//   //   apiKeyAuthorizationMode: {
//   //     expiresInDays: 30
//   //   }
//   // }
// });
