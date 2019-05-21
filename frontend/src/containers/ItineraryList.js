import React from 'react'
import { connect } from 'react-redux'
// import Itinerary from './Itinerary'
import ItineraryItem from '../components/ItineraryItem'

const mapStateToProps = (state) => ({
  itineraries: state.itineraries
})

const mapDispatchToProps = {
  loadItineraries: () => {
    return dispatch => {
      fetch("http://localhost:3000/itineraries/") // change this to request from the selected itinerary eventually....
      .then(res => res.json())
      .then(itineraries => {
        dispatch({ type: "ITINERARY_LIST", payload: itineraries })
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class ItineraryList extends React.Component {

    componentDidMount() {
      this.props.loadItineraries()
    }

    render() {
      return (
        <div>
          {!!Object.keys(this.props.itineraries).length //Tests if this.state has any keys, if not the fetch hasn't completed yet
          ? (
            <ul>
              {this.props.itineraries.map((i,index) => <ItineraryItem {...i} key={index}/>)}
            </ul>
            )
          : (<h2>...</h2>)
          }
        </div>
      ) // The form here should be a find or create style dropdown...
    }
  }
)

// export default App;
