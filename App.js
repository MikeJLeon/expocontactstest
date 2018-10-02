import React from 'react';
import { TouchableOpacity, SectionList, StyleSheet, Text, View, Image, FlatList} from 'react-native';
import { Contacts, Permissions } from 'expo';
import _ from 'lodash';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSections:[],
      dataContacts:[]
    };
  }
  async componentDidMount() {
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
      //console.log(data.total);
      //Check if at least 1 contact is available
      const sections = [];
      if (data.total > 0) {
        //Grab contact name
        //Print contact name in log
        for (let prop in data.data) {
          let name = (data.data[prop].name);
          let fL = name.charAt(0);
          let image;
          if(data.data[prop].imageAvailable){
            image = data.data[prop].image.uri;
          }else{
            image = "https://s3.eu-west-2.amazonaws.com/soundwise/uploads/user-profile/default.png";
          }
          if(!(fL in sections)){
            sections.push({name: name, image: image, letter: fL});
          }else{
            sections.push({name: name, image: image, letter: fL});
          }
        }
        console.log(sections);
        sections = _.groupBy(sections, d => d.letter);
        sections = _.reduce(sections, (acc, next, index) => {
          acc.push({
            key:index,
            data:next
          })
        console.log(sections);
          return acc
        }, [])
        this.setState({dataSections: sections})
        this.setState({dataContacts: data.data});
      }
    }
  }  

  render() {
    renderItem = (item) => {
      return (
        <View style={styles.contacts}>
          <Image style={styles.image} source={{uri: item.item.image}}/>
          <Text style={styles.name}>{item.item.name}</Text>
          <TouchableOpacity style={styles.button}>
          </TouchableOpacity>
        </View>
      );
    }

    renderSectionHeader = (headerItem) => {
      return <Text style={styles.sections}>{headerItem.section.key}</Text>;
    }
/*       const _renderItem = ({item}) => {
      if(!item.imageAvailable){
         return (
            <View style={styles.contacts}>
              <Image style={styles.image} source={{uri: 'https://s3.eu-west-2.amazonaws.com/soundwise/uploads/user-profile/default.png'}}/>
              <Text style={styles.name} key={item.id}>{item.name}</Text>
              <TouchableOpacity style={styles.button}>
              </TouchableOpacity>
            </View>
            )
      }else{
        return (
          <View style={styles.contacts}>
            <Image style={styles.image} source={{uri: item.image.uri}}/>
            <Text style={styles.name} key={item.id}>{item.name}</Text>
            <TouchableOpacity style={styles.button}>
            </TouchableOpacity>
          </View>
        )
      }
    }  */
    return (
      <View style={styles.container}>
        <Text>First line</Text>
        {/* <FlatList
          data={this.state.dataContacts}
          renderItem={_renderItem}
          keyExtractor={item => item.id}
        /> */}
        <SectionList
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          sections={this.state.dataSections}
          keyExtractor={(item) => item.name}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  sections:{
    backgroundColor:"yellow",
  },
  contacts:{
    flex:1, 
    flexDirection:"row",
    justifyContent:"space-between"
  },
  image:{
    margin:10,
    width:50,
    height:50,
  },
  name:{
    padding:10,
    position:'absolute',
    left:60,
    top:15,
  },
  button:{
    marginTop:25,
    marginRight:10,
    width:60,
    height:25,
    backgroundColor:"orange",
  }
});
