import React from 'react';
import { BrowserRouter, Switch, Route, Link , browserHistory} from "react-router-dom";
import { createBrowserHistory } from 'history';
import { makeStyles , withStyles } from '@material-ui/core/styles';
import Sidebar from './components/Sidebar';
import LogsComponent from './components/Logs';
import MapComponent from './components/Map';
import TagComponent from './components/Tags';
import DashboardCompoonent from './components/Dashboard';

export const history = createBrowserHistory()

function App() {
  const drawerWidth = 130;
  const useStyles = makeStyles(theme => ({
    workArea:{
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      height:'100%'
  }}));
  const classes = useStyles();
  return (
    <BrowserRouter history={history}>
      <Sidebar/>
      <div className={classes.workArea}>
        <Route exact path="/logs"><LogsComponent/></Route>
        <Route exact path="/tags"><TagComponent/></Route>
        <Route exact path="/map"><MapComponent/></Route>
        <Route exact path="/"><DashboardCompoonent/></Route>
      </div>
    </BrowserRouter>
  )
}

export default App;
