

import { useState } from 'react';
import './App.css';
const uuid = require('uuid');

function App() {
  const [image, setImage]= useState('');
  const[uploadResultMessage, setUploadResultMessage]=useState('Please upload an image to aunthenticate');
  const[visitorName,setVisitorName]= useState('placeholder.jpeg');
  const[isAuth,setAuth]=useState(false);

  function sendImage(e){
    e.preventDefault();
    console.log("Image File : ",image);
    setVisitorName(image.name);
    const vistorImageName = uuid.v4();
    console.log("VistorImageName : ", vistorImageName + '.jpeg');
    fetch(`https://40jxwxpx9a.execute-api.ap-northeast-1.amazonaws.com/dev/visit-images/${vistorImageName}.jpeg`, {
      method:'PUT',
      headers:{
        'Content-Type':'image/jpeg'
      },
      body: image
    }).then(async ()=>{
      const response = await authenticate(visitorName);
      console.log(response);
      if(response.Message==='Success'){
        setAuth(true);
        setUploadResultMessage(`hi ${response['firstName']} ${response['lastName']},welcome`)

      }else {
        setAuth(false);
        setUploadResultMessage('Authenication Failed: this person is not an employee.')}
    }).catch(error =>{
      setAuth(false);
      setUploadResultMessage( 'There is an error during the authenication process. Please try again.')
      console.error(error);
    })

 } 
  async function authenticate(visitorImageName){
    const requestUrl = 'https://40jxwxpx9a.execute-api.ap-northeast-1.amazonaws.com/dev/employee?' + new URLSearchParams({
      objectKey: `${visitorImageName}.jpeg`
    });
    
    return await fetch(requestUrl,{
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then((data)=>{
      return data;
    }).catch(error=> console.error(error));
  }
  return (
    <div className="App">
      <h2>Facial recognition system</h2>
      <form onSubmit={sendImage}>
      <input type='file' name='image' onChange={e=>setImage(e.target.files[0])}/>
      <button type='submit'>Authenticate</button>
</form>
<div  className={isAuth ? 'success' : 'failure'}>{uploadResultMessage}</div>
<img src={require(`./visitors/${visitorName}`)} alt='Visitor' height={250} width={250}></img>
    </div>
  );
}

export default App;
