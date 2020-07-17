import React , { useState, useEffect } from 'react';
// import { useDispatch , useSelector } from 'react-redux';
import { makeStyles , withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import MapIcon from '@material-ui/icons/Map';
import ListItemText from '@material-ui/core/ListItemText';
import HistoryIcon from '@material-ui/icons/History';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import DashboardIcon from '@material-ui/icons/Dashboard';


import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import { loadCategories as loadCategoriesAction } from '../../actions/categoryAction';
// import { loadCategories as loadSubCategoriesAction } from '../../actions/subcategoryAction';
// import { loadGoods } from '../../actions/goodsAction';

const drawerWidth = 130;

const useStyles =  makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  workArea:{
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  toolbar:{
    marginTop:0
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  name:{
    fontWeight:'bold',
    display:"flex",
    justifyContent:"center",
    alignItems:'center',
    height:'50px',
    fontSize:"1.2em"
  },
  ListItemText:{
    marginLeft:'5px'
  }
}));

const NestedList = withStyles({
    root:{
        paddingLeft: "40px",
    }
})(ListItem);

export default function PermanentDrawerLeft() {
  const classes = useStyles();
  const [slider, openSlider] = useState(false);

  function handleSlider(){
      openSlider(!slider);
  };


  return (
    <div className={classes.root}>
      <CssBaseline />
      
      <Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper, }} anchor="left">
        <div className={classes.toolbar} />
        <Link to="/" style={{ textDecoration: 'none', color:"black"  }}>
            <ListItem button key={'NFCReader'}>
            <div className={classes.name}>NFCReader</div>
            </ListItem>
        </Link>
        <Divider />

        <List> 
        <Link to="/" style={{ textDecoration: 'none', color:"black"  }}>
            <ListItem button key={'Dashboard'}>
              <DashboardIcon/>
              <ListItemText className={classes.ListItemText} primary={'Dashboard'} />
            </ListItem>
        </Link>
        <Link to="/logs" style={{ textDecoration: 'none', color:"black"  }}>
            <ListItem button key={'Logs'}>
              <HistoryIcon/>
              <ListItemText className={classes.ListItemText} primary={'Logs'} />
            </ListItem>
        </Link>
  
        <Link to="/tags" style={{ textDecoration: 'none', color:"black"  }}>
            <ListItem button key={'Tags'}>
              <AssignmentIndIcon/>
              <ListItemText className={classes.ListItemText} primary={'Tags'} />
            </ListItem>
        </Link>
        <Link to="/map" style={{ textDecoration: 'none', color:"black"  }}>
            <ListItem button key={'Map'}>
              <MapIcon/>
              <ListItemText className={classes.ListItemText} primary={'Map'} />
            </ListItem>
        </Link>
        </List> 
         
        
      </Drawer>
    </div>
  );
}
