import axios from 'axios'
import moment from 'moment'
import * as Auth from '../shared/auth'
import { createStore } from 'vuex'

export default createStore({
  state: {
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
          sighting => sighting.id === payload.id
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
    loadStoredUser({ commit }) {
      commit('setLoggedIn', Auth.isLoggedIn())
    },

    async loadUser({ commit, dispatch }) {
      if (Auth.isLoggedIn()) {
        try {
          const user: User = (await axios.get(`/user`)).data
          commit('setUser', user)
          commit('setLoggedIn', true)
        } catch (error) {
          dispatch('logout')
        }
      }
    },

    logout({ commit }) {
      commit('setUser', null)
      commit('setLoggedIn', false)
      Auth.logOut()
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
