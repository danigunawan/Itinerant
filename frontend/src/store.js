import { createStore, compose, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
// import history from './history'

// const initialState = {
// }

const reducer = (state = {
  itineraries: [],
  selected_itinerary: {}
}, action) => {
  switch(action.type){
    case "LOAD_SELECTED_ITINERARY":
      return {...state, selected_itinerary: action.payload}
    case "ADD_ATTRACTION":
      console.log(action.payload)
      return {...state, selected_itinerary: {
        ...state.selected_itinerary,
        cities: [
          ...state.selected_itinerary.cities.map( (c, c_i) =>
            c.name === action.payload.city
            ? {...c, areas: [
              ...state.selected_itinerary.cities[c_i].areas.map( (a, a_i) =>
                a.name === action.payload.area
                ? {...a, attractions: [
                  ...state.selected_itinerary.cities[c_i].areas[a_i].attractions, {
                    name: action.payload.name,
                    classification: action.payload.types,
                    description: "test"
                  }
                ]}
                : a
              )
            ]}
            : c
          )
        ]}} // whew. This correctly imports an attraction, if you find it by searching the map and you manually enter the City and Area. Needs to be made more easy to use, and needs to be refactored probably...
    default:
      return state
  }
}

const middleware = compose(
    applyMiddleware(ReduxThunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)


export const store = createStore(reducer, middleware)
