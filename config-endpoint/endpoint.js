const serverL = 'localhost:3200'
const server = '15.228.60.51:3200'
const serverQa = '15.228.60.51:3200'
const portClient = '3389'
const endpointTarget = `http://${server}`
const url = `http://localhost:8080`
const imgEndpoint = `${endpointTarget}/static/users/`
const database = 'egda-syswa'
const endPoint = { 
    imgEndpoint: imgEndpoint, 
    portClient:portClient, 
    database: database,
    endpointTarget:endpointTarget,
    url: url,
    server:server 
}

module.exports = endPoint