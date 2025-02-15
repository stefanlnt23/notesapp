import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "portfolioStorage",
  access: (allow) => ({
    "blog/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
    "services/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
    "projects/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
    "assets/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
    ]
  }),
});
