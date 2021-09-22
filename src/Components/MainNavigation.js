import { useContext } from 'react';
import { Link } from 'react-router-dom';

import classes from './MainNavigation.module.css';
import FavoritesContext from '../Store/favorites-context';

function MainNavigation() {
  const favoritesCtx = useContext(FavoritesContext);

  return (
    <header className={classes.header}>
      <div className={classes.logo}>TeamSwipe</div>
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
                {favoritesCtx.totalFavorites}
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;