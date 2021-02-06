import firebase from 'firebase/app';
import 'firebase/storage';
import {upload} from './main.js';

const firebaseConfig = {
    apiKey: "AIzaSyCjVL-f85FuDNO_F30ntooxtyCqWzkl60c",
    authDomain: "anastasiya-uploder.firebaseapp.com",
    projectId: "anastasiya-uploder",
    storageBucket: "anastasiya-uploder.appspot.com",
    messagingSenderId: "1060499599517",
    appId: "1:1060499599517:web:5dac1e45f7117d38b96474"
  };
  firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

upload('#file', {
    multi: true,
    accept: ['.png', 'jpeg', '.jpg', '.gif'],
    onUpload(files, blocks){
        files.forEach((file, i) => {
            const ref = storage.ref(`images/${file.name}`);
            const task = ref.put(file);

            task.on('state_changed', snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) *100).toFixed(0)  + '%';
                const block = blocks[i].querySelector('.preview__info_progress');
                block.textContent = percentage;
                block.style.width = percentage;

            }, error => {
                console.lof(error);
            }, () =>{
                task.snapshot.ref.getDownloadURL().then(url =>{
                   console.log('Download URL', url); 
                });
            });
        });
    }
});