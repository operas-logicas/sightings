const sightingShowResource = require('./sightingShowResource')

module.exports = function(sightings) {
  return {
    data: sightings.forEach(async sighting =>
      await sightingShowResource(sighting)
    ) || []
  }
}
