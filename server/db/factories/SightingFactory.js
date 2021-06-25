const faker = require('faker')

// Title prefix
const _prefix = [
  'Abducted by aliens in',
  'Beamed up into alien ship in',
  'Beams of light over',
  'Bizarre dreams while staying in',
  'Close encounter in',
  'Flash of light in the sky over',
  'Hovering over house in',
  'Landed in backyard in',
  'UFO sighting in',
  'Unidentified life form spotted in'
]

// States
const _states = [
  'utah',
  'wyoming',
  'colorado'
]

// State GPS coordinates
const _stateCoords = {
  utah: {
    min_lat: 37.008065,
    max_lat: 41.981231,
    min_lng: -111.058133,
    max_lng: -114.027189,
  },

  wyoming: {
    min_lat: 41.007221,
    max_lat: 44.968645,
    min_lng: -104.090055,
    max_lng: -111.025174
  },

  colorado: {
    min_lat: 37.005726,
    max_lat: 40.976539,
    min_lng: -102.06857,
    max_lng: -109.031156
  }
}

// US GPS coordinates
const _usCoords = {
  min_lat: 35,
  max_lat: 45,
  min_lng: -90,
  max_lng: -120
}

class SightingFactory {
  constructor() {
    // Protected
    this._state = faker.random.arrayElement(_states)
    this._min_lat = _stateCoords[this._state].min_lat || _usCoords.min_lat
    this._max_lat = _stateCoords[this._state].max_lat || _usCoords.max_lat
    this._min_lng = _stateCoords[this._state].min_lng || _usCoords.min_lng
    this._max_lng = _stateCoords[this._state].max_lng || _usCoords.max_lng

    // Public
    this.title =
      faker.random.arrayElement(_prefix) + ' '
      + faker.address.city() + ', '
      + this._state.slice(0, 1).toUpperCase() + this._state.slice(1)

    this.date = faker.date.past(10)

    this.description = faker.lorem.paragraph()

    this.location =
      faker.address.latitude(this._max_lat, this._min_lat, 6) + ','
      + faker.address.longitude(this._max_lng, this._min_lng, 6)

    this.state = this._state.slice(0, 1).toUpperCase() + this._state.slice(1)

    // TODO img_path
    this.img_path = ''
  
    return {
      title: this.title,
      date: this.date,
      description: this.description,
      location: this.location,
      state: this.state,
      img_path: this.img_path
    }
  }
}

module.exports = SightingFactory
