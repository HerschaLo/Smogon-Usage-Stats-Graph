import React from 'react';
import * as smogon from 'smogon-usage-fetch'
import ReactDOM from 'react-dom';
(function () {
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})();
class SiteDisplay extends React.Component {
    constructor(props) {
        super(props)
        let pokemonData = []
        let counter = 0
        const client = new smogon.SmogonApiClient()
        this.state = {
            pokemonData: pokemonData,
            pokeName: [''],
            activeDisplay: -1,
        }
    }
    render() {
        return (
            <div>
            </div>
            )
    }
}
ReactDOM.render(
    <SiteDisplay />,
    document.getElementById('root')
);