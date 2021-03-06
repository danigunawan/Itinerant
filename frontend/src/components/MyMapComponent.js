import React from 'react'
import key from '../key'
// import { connect } from 'react-redux'


const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} = require("react-google-maps");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");


const MapWithASearchBox = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${key}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
    // addAttraction: (places) => {console.log(places)}
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}
      let userLat = 29.7604
      let userLng = -95.3698
      const showPosition = (position) => {
        userLat = position.coords.latitude
        userLng = position.coords.longitude

        this.setState({
          center: {
            lat: userLat,
            lng: userLng
          }
        })
      }

      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
      }

      this.setState({
        bounds: null,
        center: {
          lat: userLat,
          lng: userLng
        },
        markers: [], // **?????
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          })
        },
        onCenterChanged: () => {
          this.setState({
            center: refs.map.getCenter()
          })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onMarkerMounted: ref => {
          refs.marker = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces()
          this.props.addAnAttraction(places) // Add logic here to scrape the places object for the information I want

          // const bounds = new google.maps.LatLngBounds();

          // places.forEach(place => {
          //   if (place.geometry.viewport) {
          //     bounds.union(place.geometry.viewport)
          //   } else {
          //     bounds.extend(place.geometry.location)
          //   }
          // });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
            place_info: place
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          // refs.map.fitBounds(bounds);
        },
        markerWasClicked: (markers, marker) => {
          const placesWithoutSelected = markers.filter(m => m.place_info.place_id !== marker.place_info.place_id).map(m => m.place_info)
          const info = marker.place_info
          const places = [info, ...placesWithoutSelected]
          this.props.addAnAttraction(places)

          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
            place_info: place
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
          this.setState({
            center: nextCenter,
            markers: nextMarkers
          })
        }
      })
    },
  }),
  withScriptjs,
  withGoogleMap
)((props) =>

  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={12}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
    onCenterChanged={props.onCenterChanged}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={11}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Search for an attraction"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginBottom: `20px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    {props.markers.map((marker, index) =>
      <Marker
        ref={index === 0 ? props.onMarkerMounted : null}
        key={index}
        position={marker.position}
        onClick={() => props.markerWasClicked(props.markers, marker)}
      >
        { // Entering a search term with no results unmounts the marker, and the infoWindow, allowing subsequent searches to display the infoWindow
          index === 0
          ? (
            <InfoWindow onCloseClick={props.onToggleOpen}>
              <div>
                {marker.place_info.name}
                <br />
                {marker.place_info.formatted_address}
              </div>
            </InfoWindow>
            )
          : null // only display the info about the first place
        }
      </Marker>
    )}
  </GoogleMap>
);

export default MapWithASearchBox
