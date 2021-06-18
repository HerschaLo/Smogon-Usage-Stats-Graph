let smogon= require('smogon-usage-fetch')
const client = new smogon.SmogonApiClient()
client
    .fetchMovesets({year:"2021", month:"01"},{ name: "gen8ou" })
    .then((moveset) => {
        console.log(moveset)
    })
    .catch(console.error)