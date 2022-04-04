import Link from 'next/link'
import classes from './MainNavigation.module.css'
import EmployeesContext from '../../Store/employees-context';
import { useContext } from 'react';

function MainNavigation(props) {
  const employeeCount = useContext(EmployeesContext);
  let amount = employeeCount.getEmployeeCount()

  function handleLogout() {
    localStorage.removeItem('token', null)
    localStorage.removeItem('refreshToken', null)
    employeeCount.clearPresets()
    employeeCount.update('' + 0)
    employeeCount.setNav(false)
  }

  return (
    <header className={classes.header}>
      <div>
        <img className={classes.logo} src="images/logo192.png" id="logo" alt='TeamSwipe Logo'></img>
      </div>
      {employeeCount.getNav() ? <nav>
        <ul>
          <li>
            <Link href="/account"><a>Account</a></Link>
          </li>
          <li>
            <Link href="/" ><a onClick={handleLogout}>Logout</a></Link>
          </li>
          <li>
            <Link href="/employees">
              <a>
                My Employees
                <span className={classes.badge}>
                  {amount}
                </span>
              </a></Link>
          </li>
        </ul>
      </nav> : <h2>The Leading Employee Management Solution</h2>}
      
    </header>
  )
}

export default MainNavigation