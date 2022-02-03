import '../global.css'
import Layout from '../components/layout/layout';
import {EmployeesContextProvider} from '../Store/employees-context';

export default function App({ Component, pageProps }) {
    return (
        <EmployeesContextProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </EmployeesContextProvider>
    )
}