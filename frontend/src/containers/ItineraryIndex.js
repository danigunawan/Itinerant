import React from 'react'
import ItineraryTile from '../components/ItineraryTile'
import { connect } from 'react-redux'
import path from '../path'
import port from '../port'

const mapStateToProps = (state) => ({
  itineraries: state.itineraries
})

const mapDispatchToProps = {
  loadItineraries: () => {
    return dispatch => {
      fetch(`http://${path}${port}/itineraries/`, {
        headers: {
          "Authorization": `Bearer ${localStorage.token}`,
          "X-Requested-With": "XMLHttpRequest"
        }
      })
      .then(res => res.json())
      .then(itineraries => {
        dispatch({ type: "ITINERARY_LIST", payload: itineraries })
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class ItineraryIndex extends React.Component {

    handleSubmit = (e) => {
      e.preventDefault()
      fetch(`http://${path}${port}/itineraries/`, {
        method: 'POST',
        headers:{
          'Content-Type':'application/json',
          "Authorization": `Bearer ${localStorage.token}`,
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify({
          title: this.state.title,
          description: this.state.description,
          image_url: this.state.imageUrl
        })
      })
      .then( res => res.json())
      .then( res => {
        if (res.error) {
          this.props.history.push('/login')
        } else {
          this.props.history.push(`/itineraries/${res.details.id}`)
        }
      })
    }

    handleChange = e => {
      this.setState({
        [e.target.name]: e.target.value
      })
    }

    componentDidMount() {
      this.props.loadItineraries()
    }

    render() {
      return (
        <ItineraryTile itineraries={this.props.itineraries} handleChange={this.handleChange} handleSubmit={this.handleSubmit} {...this.state}/>
      )
    }
  }
)
