import { useClient } from '@vocdoni/react-providers'
import { lazy } from 'react'
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import { ProcessIds } from '~constants'
import Error404 from '~elements/Error404'
import RouteError from '~elements/RouteError'
import Layout from '~src/Layout'
import { SuspenseLoader } from './SuspenseLoader'

// Map of available home components
const HomeComponents = {
  Home: () => import('~elements/Home/Home'),
  Berga: () => import('~elements/Home/Berga'),
}

// @ts-ignore
const homeComponent = HomeComponents[import.meta.env.HOME] || HomeComponents.Home
const Home = lazy(homeComponent)
const Vote = lazy(() => import('~elements/Vote'))

export const RoutesProvider = () => {
  const { client } = useClient()

  const home: RouteObject = {
    index: true,
    element: (
      <SuspenseLoader>
        <Home />
      </SuspenseLoader>
    ),
  }

  if (ProcessIds.length <= 1 && import.meta.env.HOME === 'Home') {
    home.element = (
      <SuspenseLoader>
        <Vote />
      </SuspenseLoader>
    )
    home.loader = async () => await client.fetchElection(ProcessIds[0])
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <RouteError />,
      children: [
        home,
        {
          path: '/:pid',
          element: (
            <SuspenseLoader>
              <Vote />
            </SuspenseLoader>
          ),
          loader: async ({ params }) => await client.fetchElection(params.pid),
        },
        {
          path: '*',
          element: <Error404 />,
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}
