import axiosService from 'axios'

export default async function getCurrentState(
  coords: number[]): Promise<string> {
    const apiKey = 'de7fdcfba2734932be8d31c84963114a'

    return (await axiosService.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${
          coords.join('+')
      }&key=${ apiKey }`
    )).data.results[0].components.state
  }
