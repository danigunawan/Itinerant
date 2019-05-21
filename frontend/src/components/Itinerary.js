import React from 'react'
import City from './City'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  itinerary: state.selected_itinerary
})

const mapDispatchToProps = {
  addCityFromItinerary: city_info => dispatch => {
    const newCity = {
      itinerary_id: city_info.itineraryId,
      name: city_info.name,
      country: city_info.country,
      content: city_info.content
    }
    fetch(`http://localhost:3000/cities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.token}`
      },
      body: JSON.stringify({
        ...newCity
      })
    })
    .then(res => res.json())
    .then(res => { dispatch({ type: "LOAD_SELECTED_ITINERARY", payload: res})})
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (
  class Itinerary extends React.Component {

    handleChange = (e) => {
      this.setState({[e.target.id]: e.target.value})
    }

    handleSubmit = (e) => {
      e.persist()
      e.preventDefault()
      let payload = {
        itineraryId: this.props.itinerary.details.id,
        name: this.state.name,
        country: this.state.country,
        content: this.state.content
      }
      this.props.addCityFromItinerary(payload)
    }

    search = (e) => {
      e.persist()
      e.preventDefault()

    }

    handleSearch = (e) => {
      let searchTerm = e.target.value
      console.log(searchTerm)
      let searchedItinerary = {...this.props.itinerary}
      // searchedItinerary.cities = searchedItinerary.cities.filter(c => c.name.toLowerCase().includes(searchTerm))
      let test = searchedItinerary.cities.map(c => {
        if (c.name.toLowerCase().includes(searchTerm)) {
          console.log(c.name.toLowerCase())
          return c
        } else {
          let city = {...c}
          let filteredCity = []
          filteredCity = city.areas.filter(a => a.name.toLowerCase().includes(searchTerm))
          console.log(filteredCity)
          if (filteredCity.length !== 0) {
            return filteredCity
          }
        }
      })
      console.log({...searchedItinerary, cities: [...test]}) // getting there...
    }

    render() {
      console.log(this.state)
      return (
        <div>
          <form onSubmit={this.search}>
            <input type="text" placeholder="Search Itinerary" id="searchTerm" onChange={this.handleSearch} />
            <input type="submit" />
          </form>
          <h2>{this.props.details.title}</h2>
          <ul>
            {Object.keys(this.props.schedule).map((d,index) => (<li key={index}>{d}</li>))}
          </ul>
          <h4>{this.props.details.vital_info}</h4>
          {this.props.cities.map((c,index) => <City {...c} key={c.id}/>)}


          <form onSubmit={this.handleSubmit}>
            New City:
            <br />
            <input type="text" placeholder="Name" id="name" onChange={this.handleChange}/>
            <input type="text" placeholder="Country" id="country" onChange={this.handleChange}/>
            <input type="text" placeholder="Description" id="content" onChange={this.handleChange}/>
            <input type="submit" />
          </form>

          <h4>{this.props.details.helpful_info}</h4>
          <h4>{this.props.details.notes}</h4>
        </div>
      )
    }
  }
)
