import Card from './layout/Card';
import EmployeesContext from '../Store/employees-context';
import { Textarea } from '@nextui-org/react';
import { useContext } from 'react';

function AccountPage() {
  const settings = useContext(EmployeesContext);


  return (
    <section>
      <h1>Accounts</h1>
      <Card>
        <Textarea
          readOnly
          initialValue="Almost before we knew it, we had left the ground."
        />
      </Card>
    </section>
  );
}

export default AccountPage;