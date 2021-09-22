import MainNavigation from './MainNavigation';
import classes from './Layout.module.css';

function Layout(props) {
  return (
    <div style={{ 
      backgroundImage: `url(${process.env.PUBLIC_URL + '/Capture2.png'})`,
      backgroundRepeat: 'no-repeat',
      // width:'100%',
      backgroundSize: '100% 100%'
    }}>
      <MainNavigation />
      <main className={classes.main}>{props.children}</main>
    </div>
  );
}

export default Layout;