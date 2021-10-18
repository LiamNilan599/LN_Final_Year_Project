import { useContext } from 'react';
import { Link } from 'react-router-dom';
import React from 'react';
import classes from './MainNavigation.module.css';
// import FavoritesContext from '../../Store/favorites-context';
import EmployeesContext from '../../Store/employees-context';

function MainNavigation() {
  const employeesCtx = useContext(EmployeesContext);

  return (
    <header className={classes.header}>
      <div>
        <img src="logo192.png" id="logo" alt='TeamSwipe Logo'></img>
      </div>
      <nav>
        <ul>
          <li>
            <Link to='/new-meetup'>Account</Link>
          </li>
          <li>
            <Link to='/'>Logout</Link>
          </li>
          <li>
            <Link to='/employees'>
              My Employees
              <span className={classes.badge}>
                {employeesCtx.totalEmployees}
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;