import React from 'react'
import { connect } from 'react-redux'
import path from '../path'
import port from '../port'

const mapStateToProps = (state) => ({
  user: state.user
})

const mapDispatchToProps = {
  loadUser: (id) => {
    return dispatch => {
      fetch(`http://${path}${port}/users/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.token}`
        }
      }) // change this to request from the selected itinerary eventually....
      .then(res => res.json())
      .then(user => {
        dispatch({ type: "SELECT_USER", payload: user })
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (
  class UserContainer extends React.Component {
    componentDidMount() {
      this.props.loadUser(this.props.match.params.id)
    }

    render() {
      return (
        <React.Fragment>
        <br /><br />
          {this.props.user.username}
        </React.Fragment>
      )
    }
  }
)
