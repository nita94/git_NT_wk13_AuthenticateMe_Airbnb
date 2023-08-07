import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import * as sessionActions from './store/session'
import Navigation from './components/Navigation/index'
import LandingPage from './components/LandingPage'
import SpotDetails from './components/SpotDetails'
import CreateSpotForm from './components/CreateSpotForm'
import ManageSpots from './components/ManageSpots'
import EditForm from './components/EditForm'

function App() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true))
  }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
      <Switch>
        <Route exact path='/'>
          <LandingPage />
        </Route>
        <Route exact path='/spots/new'>
          <CreateSpotForm />
        </Route>
        <Route exact path='/spots/current'>
          <ManageSpots />
        </Route>
        <Route exact path='/spots/:spotId/edit'>
          <EditForm />
        </Route>
        <Route path='/spots/:spotId'>
          <SpotDetails />
        </Route>
      </Switch>}
    </>
  )
};

export default App;