import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import React from "react";
import { Toaster } from './components/ui/toaster';
import './index.css';
import { rootRoute } from './routes';
import { privateTree } from './routes/private';
import { publicRoute } from './routes/public';
import { AuthManagerWrapper } from './services/authManager';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// TODO: Uncomment this in production
// const NotFoundComponent = () => {
//   const { logout } = useContext(authContext);
//   logout();
//   return null;
// };
// const notFoundRoute = createRoute({
//   path: '*', // This matches any route that is not defined
//   component: () => <NotFoundComponent />,
//   getParentRoute: () => rootRoute,
// });
const routeTree = rootRoute.addChildren([
  publicRoute,
  privateTree,
  // notFoundRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}


const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthManagerWrapper>
        <RouterProvider router={router} />
        <Toaster />
      </AuthManagerWrapper>
    </QueryClientProvider>
  );
};

export default App;
