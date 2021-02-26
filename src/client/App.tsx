import React, { useEffect } from "react";
import { io } from 'socket.io-client';

let socket: any;

const App = () => {
  // to be moved to config file
  const ENDPOINT = 'http://localhost:3001';
  
  useEffect(() => {
   
    socket = io(ENDPOINT);
    socket.on('getFieldA', (data: any) => {
      console.log('broadcasting FieldA', data);
    });
    socket.on('getFieldB', (data: any) => {
      console.log('broadcasting FieldB', data);
    });
    socket.on('getFieldC', (data: any) => {
      console.log('broadcasting FieldC', data);
    });
    socket.on('getsomeMethodData', (data: any) => {
      console.log('broadcasting Method Result', data);
    });
    socket.on('getSomeMethodReturningAFunction', (data: any) => {
      console.log('broadcasting Method Returning Fn Result', data);
    });

    return () => {
      socket.disconnect();
      socket.off();
    }
  }, [ENDPOINT]);

  const fetchRsults = () => {

    socket.emit('getFieldA', (error: string) => {
      console.log('error in getFieldA', error);
    });  
    socket.emit('getFieldB', (error: string) => {
      console.log('error in getFieldB', error);
    });
    socket.emit('getFieldC', (error: string) => {
      console.log('error in getFieldC', error);
    });;
    socket.emit('getsomeMethodData', 6, (error: string) => {
      console.log('error in getsomeMethodData', error);
    });
    socket.emit('getSomeMethodReturningAFunction', 4, (error: string) => {
      console.log('error in getSomeMethodReturningAFunction', error);
    });   
  }

  return (
    <div className="App">
      <header className="App-header">
        <input type="button" value= "Test events" onClick={() => fetchRsults()} />
      </header>
    </div>
  );
}
export default App;