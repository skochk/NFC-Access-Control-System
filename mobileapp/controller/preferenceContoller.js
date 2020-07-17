import DefaultPreference from 'react-native-default-preference';
import { CONSTANTS , JSHash} from 'react-native-hash';


module.exports.get = async(key)=>{
    return new Promise((resolve,reject)=>{
        DefaultPreference.get(key).then(value=>{
            if(value !== null){
                resolve(value);
            }else{
                JSHash(new Date().getDate(), CONSTANTS.HashAlgorithms.sha256)
                .then(hash => {
                    DefaultPreference.set(key,hash).then(value=>{
                        resolve(value);
                        // console.log('new default preference setted');
                    });
                })
                .catch(e => reject(e));
                
            }
        })
    })

    // DefaultPreference.clearAll();
}