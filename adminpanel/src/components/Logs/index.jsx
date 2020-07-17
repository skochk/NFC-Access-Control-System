import React, {useState, useEffect} from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import { forwardRef } from 'react';
import { withStyles ,makeStyles } from '@material-ui/core/styles';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });
let columns = [
    {title:'Event Type',field:"eventType"},
    {title:'Identificator NFC tag',field:"identificatorNFC"},
    {title:'Date',field:"date",
        type:'datetime',
        defaultSort: 'desc'    
    },
    {title:'Author',field:"author",
        cellStyle:{
            maxWidth:"200px",
            wordWrap: 'break-word'
        }},
    {title:'IP',field:"ip"},
];
const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };


function Logs() {
    let [logsData,setLogsData] = useState([]); 
    const classes = useStyles();

    useEffect(()=>{
        axios.get('/api/logs')
            .then((data)=>{
                console.log(data.data);
                setLogsData(data.data);
            });
    },[]);

    return (
        <div>
            <MaterialTable
                icons={tableIcons}
                title='Log list'
                columns={columns}
                data={logsData}
                style={{width:"100%"}}
                onRowClick={
                    (event, rowData)=>{
                        console.log(rowData)
                    }
                }
                options={{
                    pageSize:20,
                    pageSizeOptions:[20,Math.round(logsData.length/2),Math.round(logsData.length)],
                    filtering: true
                }}
            />
        </div>
        
    )
}

export default Logs;
