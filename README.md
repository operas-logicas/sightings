# sightings

### Project setup
```
npm install
```
##

### Compiles and hot-reloads Vue CLI service for development
```
npm run serve
```
##

### Start server plus compile and hot-reload for development
Uses Nodemon (must install separately) and Concurrently (included in package.json) to start Express HTTP/HTTPS server (on port 3000/3001 by default) plus compile and hot-reload Vue CLI service for development
```
npm run dev
```
(will need key.pem and cert.pem in root 'https' directory for HTTPS)
##

### Starts server plus compiles and minifies for production
Starts Express HTTP/HTTPS server (on port 5000/5001 by default) plus compiles and minifies for production
```
npm run build
```
(will need key.pem and cert.pem in root 'https' directory for HTTPS)
##

### Lints and fixes files
```
npm run lint
```
##

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
