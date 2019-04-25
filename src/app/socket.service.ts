import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
//import { Socket } from 'net';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = 'http://192.168.1.67:3000';

  public socket;


  constructor(public http: HttpClient,) {
    // connection is being created.
    // that handshake
    this.socket = io(this.url);

  }

  // events to be listened 
  
  public verifyUser = () => {

    return Observable.create((observer) => {

      this.socket.on('verifyUser', (data) => {
          Cookie.set("socketId",this.socket.id)
        observer.next(data);
        console.log(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;")

      }); // end Socket

    }); // end Observable
    

  } // end verifyUser

  public onlineUserList = () => {

    return Observable.create((observer) => {
      console.log(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;")

      this.socket.on("online-user-list", (userList) => {

        observer.next(userList);
        console.log(userList);
        console.log(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;")

      }); // end Socket

    }); // end Observable

  } // end onlineUserList

  public normalUserList = ()=>{

    return Observable.create((observer) =>{

      this.socket.on('all-Normal-user-list',(allNormalUserList) => {

        observer.next(allNormalUserList);
        console.log('the normal user list are:',allNormalUserList);
      });
    });
  }

  public disconnectedSocket = () => {

    return Observable.create((observer) => {

      this.socket.on("disconnect", () => {

        observer.next();

      }); // end Socket

    }); // end Observable

    



  } // end disconnectSocket

  // end events to be listened

  // events to be emitted

  public setUser = (authToken) => {

    this.socket.emit("set-user", authToken);

  } // end setUser

  // events to be emitted
  

  public sendNotificationRequest = (authToken,socketId) =>{
    let userdata1 ={authToken:authToken,userSocketId:socketId}
    this.socket.emit('notification1',userdata1);
  }


  public getNotification = () =>
  {
    return Observable.create((observer) => {
      this.socket.on('notification-send',notificationObj=>{
        observer.next(notificationObj);
        console.log("notifiation recieved from the server is:",notificationObj);

      });
    });

  }

  // this.socket.on('notification-send',notificationObj=>{
  //   //observer.next(notificationObj);
  //   console.log("notifiation recieved from the server is:",notificationObj);

  // });

  public getNotificationForCreate =() =>
  {
    return Observable.create((observer) => {
      this.socket.on('notification-for-new-event',notificationObj=>{
        observer.next(notificationObj);
        console.log("notifiation recieved from the server for new event creation is:",notificationObj);

      });
    });

  }

  


  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError


  public sendNotificationSendRequestToServerOnCreate =(userData) =>{
    console.log("function to request to send notification to user on create called with detail called ",userData)

    this.socket.emit('send-notification-on-event-create',userData);

  }

  public exitSocket = () => {


    this.socket.disconnect();


  } // end exit socket
}
