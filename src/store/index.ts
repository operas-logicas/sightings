import moment from 'moment'
import { createStore } from 'vuex'
import Auth from '../services/AuthService'

const protocol = window.location.protocol
const hostname = window.location.hostname
let port: number;

// Development
if (hostname === 'localhost')
  port = protocol === 'https:' ? 3001 : 3000

// Production
else port = protocol === 'https:' ? 5001 : 5000

export default createStore({
  state: {
    apiUrl: `${protocol}//${hostname}:${port}/api`,
    sightings: [] as Sighting[],
    currentPosition: [] as number[],
    isLoggedIn: false,
    user: null as unknown as User,
  },

  mutations: {
    setSightings(state, sightings: Sighting[]) {
      state.sightings = sightings
    },

    setSighting(state, sighting: Sighting) {
      state.sightings.push(sighting)
    },

    updateSighting(state, payload: Sighting) {
      // console.log(state.sightings)
      state.sightings[
        state.sightings.findIndex(
          sighting => sighting._id === payload._id
        )
      ] = payload
    },

    setCurrentPosition(state, coords: number[]) {
      state.currentPosition = coords
    },

    setUser(state, user: User) {
      state.user = user
    },

    setLoggedIn(state, isLoggedIn: boolean) {
      state.isLoggedIn = isLoggedIn
    }
  },

  actions: {
    authenticate({ commit }) {
      if (Auth.isLoggedIn()) {
        const user = Auth.getUser()
        commit('setUser', user)
        commit('setLoggedIn', true)
      } else {
        commit('setUser', null)
        commit('setLoggedIn', false)
      }
    }
  },

  getters: {
    topSightings: (state): Sighting[] => {
      const sightings = []

      for (const sighting of Object.values(state.sightings)) {
        sightings.push(sighting)
      }

      const end = sightings.length > 3 ? 3 : sightings.length

      return {
        ...sightings
          .sort((a: Sighting, b: Sighting) => {
            // Sort by likes desc
            if (b.likes > a.likes) return 1
            if (a.likes > b.likes) return -1

            // If likes are the same, sort by dates desc
            const date1 = moment(a.date)
            const date2 = moment(b.date)

            if (date2.diff(date1) > date1.diff(date2)) return 1
            else return -1
          })
          .slice(0, end)
      }
    }
  }
})
