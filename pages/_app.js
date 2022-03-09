import '../global.css'
import { NextUIProvider } from '@nextui-org/react';
import Layout from '../components/layout/layout';
import {EmployeesContextProvider} from '../Store/employees-context';

export default function App({ Component, pageProps }) {
    return (
        <NextUIProvider>
        <EmployeesContextProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </EmployeesContextProvider>
        </NextUIProvider>
    )
}