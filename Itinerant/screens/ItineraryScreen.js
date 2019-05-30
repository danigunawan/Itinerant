import React from 'react';
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  AsyncStorage
} from 'react-native';
import { WebBrowser, Location, Permissions } from 'expo';
import City from './City'
import Attraction from './Attraction'
import path from '../components/path'

import { MonoText } from '../components/StyledText';

export default class ItineraryScreen extends React.Component {
  static navigationOptions = {
    title: "Itinerary",
    headerStyle: {
      backgroundColor: '#923c2d',
    },
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerTintColor: '#fff',
  };

  state = {
    cities: [],
    searchTerm: ""
  }

  handleSearch = (e) => {
    console.log(e)
    if (e !== undefined) { // Checks for no search term
      this.setState({searchTerm: e})
    }
  }

  searchedItinerary = () => {
    const searchTerm = this.state.searchTerm.toLowerCase()
    if (searchTerm === "") {
      return {...this.state, ...this.props.itinerary}
    } else {
      let searchedAttractions = this.state.attractions.map(at => {
        if (
          at.name.toLowerCase().includes(searchTerm)
          || at.classification.toLowerCase().includes(searchTerm)
          || at.description.toLowerCase().includes(searchTerm)
        ) {
          return at
        } else {
          return null
        }
      })
      let filteredAttractions = searchedAttractions.filter(Boolean)
      return {searchTerm: searchTerm, details: {id: this.state.details.id, title: this.state.details.title}, attractions: [...filteredAttractions]}
    }
  }

  sortByDistance = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(location)
    fetch(`http://${path}:3000/itineraries/${this.state.details.id}/nearest`, {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user_info.auth_token}`
      },
      body: JSON.stringify({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })
    })
    .then( res => res.json())
    .then( res => {
      console.log(res)
      this.setState({
         location,
         filter: true,
         attractions: res
       })
    })
  }

  componentDidMount() {
    AsyncStorage.getItem('user').then( user_res => {
      user_info = JSON.parse(user_res)
      AsyncStorage.getItem('itinerary').then( itinerary_res => {
        console.log(itinerary_res)
        fetch(`http://${path}:3000/itineraries/${itinerary_res}`, {
          headers:{
            "Authorization": `Bearer ${user_info.auth_token}`
          }
        })
        .then( res => res.json())
        .then( res => {
          if (res.error) {
            console.log(res.error)
            AsyncStorage.removeItem('user')
            .then(res => {
              this.props.navigation.navigate('Login')
            })
          } else {
            this.setState({
              cities: res.cities,
              attractions: res.attractions,
              details: res.details,
              schedule: res.schedule
            })
          }
        })
      })
    })
  }

  render() {
    let itinerary = this.searchedItinerary()
    console.log(itinerary)
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View>
            {
              !itinerary.searchTerm
              ?
                null
              :
                (
                  <TouchableOpacity
                    style={styles.sortButton}
                    onPress={this.sortByDistance}
                  >
                    <Text style={styles.sortButtonText}>Sort by distance</Text>
                  </TouchableOpacity>
                )
            }
            <TextInput
              style={styles.textInput}
              placeholder="Search Itinerary"
              value={this.state.searchTerm}
              onChangeText={this.handleSearch}
            />
          </View>
          {
            !itinerary.searchTerm
            ?
              (
                <View style={styles.getStartedContainer}>
                  {itinerary.cities.map( c => (
                    <View key={c.id}>
                      <City {...c}/>
                    </View>
                  ))}
                </View>
              )
            :
              (
                <View style={styles.getStartedContainer}>
                  {itinerary.attractions.map( a => (
                    <View key={a.id}>
                      <Attraction {...a}/>
                    </View>
                  ))}
                </View>
              )
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sortButton: {
    borderWidth: 1,
    borderColor: '#923c2d',
    backgroundColor: '#923c2d',
    padding: 15,
    margin: 5
  },
  sortButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center'
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});





//
// searchedItinerary = () => {
//   const searchTerm = this.state.searchTerm.toLowerCase()
//   if (searchTerm === "") {
//     return {...this.state, ...this.props.itinerary}
//   } else {
//     let searchedCities = this.state.cities.map(c => {
//       if (c.name.toLowerCase().includes(searchTerm)) {
//         return {...c, plans: []} // If the city name matches, return the whole city
//       } else {
//         let city = {...c, plans: []}
//         let searchedAreas = city.areas.map(a => {
//           if (a.name.toLowerCase().includes(searchTerm)) {
//             return a
//           } else {
//             let area = {...a}
//             let searchedAttractions = area.attractions.map(at => {
//               if (
//                 at.name.toLowerCase().includes(searchTerm)
//                 || at.classification.toLowerCase().includes(searchTerm)
//                 || at.description.toLowerCase().includes(searchTerm)
//               ) {
//                 return at
//               } else {
//                 return null
//               }
//             })
//             let filteredAttractions = searchedAttractions.filter(Boolean)
//             if (filteredAttractions.length !== 0) {
//               return {...area, attractions: [...filteredAttractions]} // If we get any hits on attraction, return the city, area, and attraction
//             } else {
//               return null
//             }
//           }
//         })
//         let filteredAreas = searchedAreas.filter(Boolean)
//         if (filteredAreas.length !== 0) {
//           return {...city, areas: [...filteredAreas]} // If we get any hits on area name, return the city and those areas
//         } else {
//           return null
//         }
//       }
//     })
//     let filteredCities = searchedCities.filter(Boolean)
//     return {schedule: [], details: {id: this.state.details.id, title: this.state.details.title}, cities: [...filteredCities]}
//   }
// }
