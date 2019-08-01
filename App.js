import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SignIn from './src/SignIn';
import Meteor, { createContainer, Accounts } from 'react-native-meteor';
// import { withTracker } from 'meteor/react-meteor-data';
// import { withTracker } from 'react-meteor-data';
import PokeMap from './src/PokeMap';

const SERVER_URL = 'ws://localhost:3000/websocket';
// const SERVER_URL = 'ws://192.168.1.3:3000/websocket';

export default class App extends React.Component {
  state = {
    loggedIn: false
  }
  componentWillMount(){
    // to sort diconnected from DDP server message
    // adb reverse tcp:3000 tcp:3000
    Meteor.connect(SERVER_URL);
    console.log(Meteor.userId())
    if(Meteor.userId()){
      this.flipLogin(true);
    }

  }
  flipLogin = (x) =>{
    this.setState({loggedIn: x})
  }
  signIn = (email, password) =>{
    Meteor.loginWithPassword(email, password, (error, data)=>{
      if(error){
        if(error.reason === "User not found"){
          console.log('there was no email');
          Accounts.createUser({email, password}, (error)=>{
            console.log(error);
          })
        }
      }
      else{
        console.log('email found');
        //TODO: send user to next screen
        this.flipLogin(true);
      }
    });
    console.log(Meteor.userId())
  }
  renderView = () =>{
    if(!this.state.loggedIn){
      return(
        <SignIn signIn={this.signIn}/>
      )
    }
    else{
      return(
        <PokeMap flipLogin={this.flipLogin}/>
      )
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderView()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});
