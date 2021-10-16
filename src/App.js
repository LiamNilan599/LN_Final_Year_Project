import { Route, Switch } from 'react-router-dom';
import React from 'react'
import AllMeetupsPage from './Pages/AllMeetups';
import NewMeetupPage from './Pages/NewMeetup';
import EmployeesPage from './Pages/Employees';
import Layout from './Components/Layout/Layout';

function App() {
  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <AllMeetupsPage />
        </Route>
        <Route path='/new-meetup'>
          <NewMeetupPage />
        </Route>
        <Route path='/employees'>
          <EmployeesPage />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;