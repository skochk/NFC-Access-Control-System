import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { withStyles ,makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import TapAndPlayIcon from '@material-ui/icons/TapAndPlay';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import MapIcon from '@material-ui/icons/Map';
import {Link} from 'react-router-dom';

const useStyles = makeStyles({
    statBox:{
        height:"200px", 
        width:"300px",
        backgroundColor:"white",
        boxShadow:"0 0 0 1px rgba(63,63,68,0.05), 0 1px 3px 0 rgba(63,63,68,0.15)",
        margin:"20px",
        padding:'20px',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
    },
    area:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"#f4f6f8",
        height: "100vh",
        width:'100%',
        flex: 3,
        paddingTop:'-150px'
    }, 
    row:{
        display:"flex",
    },

    statBoxheader:{
        display:"flex",
        justifyContent:"space-between",
        alignItems:'flex-end',
        fontSize:'1.5em',
        width:"100%",
        color:'#546e7a'
    },
    icon:{
        width: "50px",
        height: "50px",
    },
    bigText:{
        fontSize:"5em",
        fontWeight:'bold',
        cursor:'pointer'
    },
    bottombox:{
        display:"flex",
        justifyContent:'center',
        alignItems:"center",
        flexDirection:'column',
        height:'100%',
        textAlign:'center'
    },

})
function Dashboard() {
    const classes = useStyles();
    const [totalScanned, setTotalScanned] = useState('');
    const [mostPopularTag, setMostPopularTag] = useState('');
    const [lastScannedTag, setLastScannedTag] = useState({});

    useEffect(()=>{
        axios.get('/api/stats/scancount')
        .then(data=>{
            setTotalScanned(data.data.count);
        });
        axios.get('/api/stats/mostpopulartag')
        .then(data=>{
            // console.log(data.data.count[0]._id) // name of most popular item, 
            setMostPopularTag(data.data.count[0]._id);
        });
        axios.get('/api/stats/lastscannedtag')
        .then(data=>{
            // console.log(data.data);
            let convertedDate ='';
            let day = data.data.date.split('T')[0];
            let time = data.data.date.split('T')[1].substring(0,8);
            convertedDate = convertedDate.concat(day," ",time);
            let tempobj = [];
            tempobj['name'] = data.data.name;
            tempobj['date'] = convertedDate;
            setLastScannedTag(tempobj);
        })
    },[])
    return (
        <div className={classes.area}>

            <div className={classes.row}>
                <div className={classes.statBox}>
                    <div className={classes.statBoxheader}>
                        <EqualizerIcon className={classes.icon}/>
                        <Typography>TOTAL SCANNED</Typography>
                    </div>
                    <Typography className={classes.bigText}>{totalScanned}</Typography>
                </div>
                <div className={classes.statBox}>
                    <div className={classes.statBoxheader}>
                        <TrendingUpIcon  className={classes.icon} style={{color:"#43a047"}}/>
                        <Typography>MOST POPULAR TAG</Typography>
                    </div>
                    <div className={classes.bottombox}>
                        <Typography>TAG ID:</Typography>
                        <Typography style={{fontSize:'2em',fontWeight:'bold'}}>{mostPopularTag}</Typography> 
                    </div>   
                </div>
                <div className={classes.statBox}>
                    <div className={classes.statBoxheader}>
                        <AccessTimeIcon className={classes.icon} style={{color:'#3f51b5'}}/>
                        <Typography>LAST SCANNED TAG</Typography>
                    </div>
                    <div className={classes.bottombox}>
                        <Typography style={{fontSize:'2em',fontWeight:'bold'}}>{lastScannedTag.name ? lastScannedTag.name : "Name of this user not set"}</Typography>
                        <Typography style={{fontSize:'1.5em',fontWeight:'bold'}}>{lastScannedTag.date}</Typography>
                    </div>
                </div>
            </div>
            <div className={classes.row}>
                <Link to="/map" style={{ textDecoration: 'none', color:"black"  }}>
                    <div className={classes.statBox}>
                        <div className={classes.bottombox}>
                            <MapIcon  className={classes.icon} style={{color:'#3f51b5'}}  style={{color:"#43a047"}}/>
                            <Typography style={{fontSize:'2em',fontWeight:'bold', color:"#546e7a"}}>Interactive map</Typography>
                        </div>
                    </div>
                </Link>
                <Link to="/logs" style={{ textDecoration: 'none', color:"black"  }}>
                    <div className={classes.statBox}>
                        <div className={classes.bottombox}>
                            <AssessmentIcon   className={classes.icon} style={{color:'#3f51b5'}}/>
                            <Typography style={{fontSize:'2em',fontWeight:'bold', color:"#546e7a"}}>View logs</Typography>
                        </div>
                    </div>
                </Link>
                <Link to="/tags" style={{ textDecoration: 'none', color:"black"  }}>
                    <div className={classes.statBox}>
                        <div className={classes.bottombox}>
                            <TapAndPlayIcon   className={classes.icon} style={{color:'black'}}/>
                            <Typography style={{fontSize:'2em',fontWeight:'bold', color:"#546e7a"}}>Manage tags</Typography>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Dashboard;
