import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// Define a minimal schema to satisfy TypeScript
const schema = a.schema({
  Placeholder: a.model({
    id: a.id()
  })
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({ schema });
