import React,{useEffect, useState,  useRef} from 'react';
import { makeStyles , withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Modal from 'react-awesome-modal';
import Select from 'react-select';
import noAvatarImg from './../../icons/noavatar.png'


const useStyles =  makeStyles(theme => ({
    area:{
        display:"flex",
        padding:'10px',
        flexWrap:'wrap'
    },
    tag:{
        height: "260px",
        width: "150px",
        border: "3px solid #ced2ff",
        borderRadius: '10px',
        padding:"5px",
        margin:"10px",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        backgroundColor:'#93b6f1',
    },
    titleText:{
        fontSize:'max(1em,5px)',
        whiteSpace:'nowrap',
        width:'140px',
        fontWeight:'bold',
        marginBottom:'5px',
        color:"white",
        textAlign:"center"
    },
    titleFieldName:{
        fontStyle:"italic",
        color:"white",
        marginBottom:'-3px'
    },
    pic:{
        height:'100px',
        maxWidth:"100px"
    },
    identificator:{
        marginBottom:'5px',
        fontWeight:'bold',
        color:"white"
    },
    button:{
        // width: "60px",
        height: '25px',
        backgroundColor:'#87ff82',
        fontWeight:'bold'
    },
    modalVindow:{
        height: "520px",
        width: "300px",
    },
    modelContent:{
        border: "6px solid #ced2ff",
        borderRadius: '10px',
        padding:"5px",
        position:'absolute',
        backgroundColor:'#93b6f1',
        zIndex: 2, /* Sit on top */
        height: "520px",
        width: "300px",
        display:"flex",
        flexDirection:"column",
        alignItems:'center',
        justifyContent:'space-between'
    },
    picBig:{
        height:'250px',
        maxWidth:'250px'
    },

    editProfButton:{
        height: '18px',
        marginTop:'5px',
        marginBottom:'10px'
    }
}));
export default function Tags() {
    const classes = useStyles();
    const [data,setData] = useState([]);
    const [editedItem,setEditedItem] = useState({});
    const [modalOpened, setModalOpened] = useState(false);
    const [editedPermission,setPermission]= useState('');
    const [photo,setPhoto] = useState('');
    const [selectValue,setSelectValue] = useState({});

    useEffect(() => {
        axios.get('/api/tags')
        .then(data=>{
            console.log(data.data);
            setData(data.data);
        })
    }, []);
     function callEdit(item){
        setEditedItem(item);
        setModalOpened(true)
        console.log(editedItem);
    }
    const selectOptions = [
        { value: 'worker', label: 'WORKER' },
        { value: 'admin', label: 'ADMIN' },
        { value: '', label: 'NONE' }
      ];
    const selectStyles = {
        control: styles=>({...styles, width:"250px",})
    }
    function handleSelect(event){
        setSelectValue(event)
        setPermission(event.value);
    }
    function saveChanges(){
        let formdata = new FormData();
        formdata.append('id',editedItem._id);  
        if(photo){formdata.append('photo',photo)};
        if(editedPermission){formdata.append('permission',editedPermission);}
        formdata.append('identificatorNFC',editedItem.identificatorNFC); // only for logs
        axios.post('/api/updatetag',formdata)
        .then(res=>{
            console.log(res.data);
            if(res.data == 'ok'){
                setModalOpened(false);
                setEditedItem({});
                setPhoto('');
                setPermission('');
                axios.get('/api/tags')
                .then(data=>{
                    setData(data.data);
                })
            }
        })
    }
    function handlePhoto(event){
        setPhoto(event.target.files[0]);
    }

    return (
            <div className={classes.area}>
                {data.map(element=>(
                    <div className={classes.tag} key={element._id}>
                        <div className={classes.titleText}>{element.name !== "" ? element.name : "Name not set"}</div>
                        <img className={classes.pic} src={element.photo ? "/uploads/"+element.photo : noAvatarImg}/>
                        <div className={classes.titleFieldName}>Identificator:</div>
                        <div className={classes.identificator}>{element.identificatorNFC}</div>
                        <div className={classes.titleFieldName}>Permission:</div>
                        <div className={classes.identificator}>
                            {element.permission ? element.permission.toUpperCase() : 'NONE'}
                        </div>
                        <Button className={classes.button} variant="contained" onClick={()=>callEdit(element)}>Edit Tag</Button>
                    </div>
                ))}

                <Modal className={classes.modal} visible={modalOpened} height='520px' width='300px' effect="fadeInUp" onClickAway={() => {setModalOpened(false);  setEditedItem({}); setPhoto(''); setPermission('')}}>
                    <div className={classes.modelContent}>
                        <div className={classes.titleFieldName}>Name:</div>
                        <div className={classes.titleText}>{editedItem.name !== "" ? editedItem.name : "Name not set"}</div>
                        <div className={classes.titleFieldName}>Identificator:</div>
                        <div className={classes.identificator}>{editedItem.identificatorNFC}</div>
                        <img className={classes.picBig} src={photo ? URL.createObjectURL(photo) : editedItem.photo ?  "/uploads/"+editedItem.photo : noAvatarImg}/>
                        
                        <input accept="image/*" style={{display:'none'}} id="newPhoto" type="file" onChange={handlePhoto} />
                        <label htmlFor="newPhoto">
                            <Button variant="contained" className={classes.editProfButton} component="span">Update photo</Button>
                        </label>
                        <div className={classes.titleFieldName}>Change permission:</div>
                        <Select style={{width:'250px'}} options={selectOptions} value={selectValue} onChange={handleSelect} styles={selectStyles}/>
                        <Button className={classes.button} variant="contained" onClick={()=>saveChanges()}>Save changes</Button>
                        <Button variant="contained" onClick={() => setModalOpened(false)}>Close</Button>
                    </div>
                </Modal>
            </div>
    )
}

