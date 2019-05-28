import React from 'react'
import Attraction from './Attraction'
import CreateAttractionModal from './CreateAttractionModal'
import EditAreaModal from './EditAreaModal'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  itinerary: state.selected_itinerary
})

const mapDispatchToProps = {
  addAttractionFromItinerary: attraction_info => dispatch => {
    const newAttraction = {
      area_id: attraction_info.areaId,
      name: attraction_info.name,
      classification: attraction_info.classification,
      description: attraction_info.description
    }
    fetch(`http://localhost:3000/attractions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.token}`
      },
      body: JSON.stringify({
        ...newAttraction
      })
    })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        console.log(res.message)
      } else {
        dispatch({ type: "LOAD_SELECTED_ITINERARY", payload: res})
      }
    })
  },
  editArea: area_info => dispatch => {
    const editArea = {
      area_id: area_info.areaId,
      name: area_info.name,
      country: area_info.country,
      content: area_info.content
    }
    fetch(`http://localhost:3000/areas/${area_info.areaId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.token}`
      },
      body: JSON.stringify({
        ...editArea
      })
    })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        console.log(res.message)
      } else {
        dispatch({ type: "LOAD_SELECTED_ITINERARY", payload: res})
      }
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (
  class Area extends React.Component {

    state = {
      name: "",
      classification: "",
      description: "",
      editName: this.props.name,
      editContent: this.props.content
    }

    handleChange = (e) => {
      this.setState({[e.target.id]: e.target.value})
    }

    handleSubmit = (e) => {
      e.persist()
      e.preventDefault()
      let payload = {
        areaId: this.props.id,
        name: this.state.name,
        classification: this.state.classification,
        description: this.state.description,
        itineraryId: this.props.itinerary.details.id
      }
      this.props.addAttractionFromItinerary(payload)
    }

    handleEditSubmit = () => {
      let payload = {
        areaId: this.props.id,
        name: this.state.editName,
        content: this.state.editContent
      }
      this.props.editArea(payload)
    }

    render() {
      return (
        <React.Fragment>
          <h3>{this.props.name}</h3>
          <p>{this.props.content}</p>
          <EditAreaModal handleChange={this.handleChange} handleEditSubmit={this.handleEditSubmit} {...this.state} />
          <ul>
            {this.props.attractions.map(a => <Attraction {...a} key={a.id}/>)}
          </ul>
          <CreateAttractionModal handleChange={this.handleChange} handleSubmit={this.handleSubmit} {...this.state}/>
        </React.Fragment>
      )
    }
  }
)
