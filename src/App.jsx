import React from 'react'
import { RouterProvider } from "react-router-dom";
import routes from './routes/Route.jsx';
import { Loader } from './components/index.jsx';
import { useSelector } from 'react-redux';

const App = () => {
  const { loading } = useSelector((state) => state.loaders);
  return (
    <div>
      {loading && <Loader />}
      <RouterProvider router={routes} />
    </div>

  )
}

export default App
