// import { Authenticator } from "@aws-amplify/ui-react";
// import { Amplify } from "aws-amplify";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
// import outputs from "../amplify_outputs.json";
// import "@aws-amplify/ui-react/styles.css";

// Amplify.configure({
//   ...outputs,
//   Auth: {
//     ...outputs.Auth,
//     Cognito: {
//       ...outputs.Auth.Cognito,
//       allowGuestAccess: true
//     }
//   }
// });

export default function App() {
  return (
    // <Authenticator.Provider>
      <RouterProvider router={router} />
    // </Authenticator.Provider>
  );
}
