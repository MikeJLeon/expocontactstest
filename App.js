import React from 'react';
import { StyleSheet, Text, View, Image, FlatList, ListItem} from 'react-native';
import { Contacts, Permissions } from 'expo';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataContacts:[]
    };
    //Get phone contacts
    this.getContacts();
  }
  async getContacts(){
    const permission = await Permissions.askAsync(Permissions.CONTACTS);
    //Check permission status
    if (permission.status !== 'granted') {
      return;
    }else{
      //Passed permission check
      console.log("We got in!")
      //Expo grab contacts by phone numbers
      const data = await Contacts.getContactsAsync({
        fields: [
          Contacts.PHONE_NUMBERS,
          Contacts.IMAGE,
          Contacts.THUMBNAIL,
          Contacts.URI
        ]
      });
      //Print contacts total
      console.log(data.total);
      //Check if at least 1 contact is available
      if (data.total > 0) {
        //Grab contact name
        const contact = data.data[0].name;
        //Print contact name in log
        console.log(data);
        console.log(data.data[0].phoneNumbers);
        console.log(data.data[0].phoneNumbers[0].number)
        this.setState({dataContacts: data.data});
        
      }
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>First line</Text>
        <FlatList
          data={this.state.dataContacts}
          renderItem={({item}) => 
            <Text>{item.name}, {item.phoneNumbers[0].number}</Text>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
