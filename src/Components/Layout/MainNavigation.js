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
      <div className={classes.img}>
        {/* TeamSwipe */}
        <img src="logo192.png" alt='TeamSwipe Logo'></img>
      </div>
      <nav>
        <ul>
          <li>
            <Link to='/'>Account</Link>
          </li>
          <li>
            <Link to='/new-meetup'>Logout</Link>
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