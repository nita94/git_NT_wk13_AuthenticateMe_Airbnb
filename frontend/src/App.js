import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <h1>corner</h1>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login"></Route>
          <Route path="/signup"></Route>
        </Switch>
      )}
    </>
  );
}

export default App;