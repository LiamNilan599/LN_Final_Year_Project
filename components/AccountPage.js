import Card from './layout/Card';
import EmployeesContext from '../Store/employees-context';
import Link from 'next/link'
import { useContext } from 'react';
function AccountPage() 
{
  const UserLogged = useContext(EmployeesContext);
  UserLogged.getLoginState()
  return (
    <section>
      <h1>Accounts</h1>
      {UserLogged.getNav() ? 
      <Card>

      </Card> : <div>
        <h1>You are not logged in</h1>
        <Link href="/" ><a className="Error a">Return to Home</a></Link>
      </div>}
    </section>
  );
}
  
  export default AccountPage;