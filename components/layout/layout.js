import MainNavigation from './MainNavigation';
import classes from './layout.module.css'

export default function Layout({ children }) {
    return (
        <div>
            <MainNavigation />
            <main className={classes.main}>{children}</main>
        </div>
    )
}