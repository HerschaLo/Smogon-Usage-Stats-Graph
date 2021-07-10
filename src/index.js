import ToolDisplay from "./index_usage.js"
import UsageInDisplay from "./index_poke_data.js"
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
                <div style={{ height: "10vh", display: "flex", flexDirection: "column" }}>
                    <div style={{ height: "4vh", display:"flex", justifyContent:"center", fontSize:"30px"}}>
                        Smogon Usage Tools
                    </div>
                    <div style={{height:"6vh"}} class="toolbar">
                        <div onClick={() => { this.setState({ selectedTool: [<ToolDisplay />,] }) }}>
                            Compare Pokemon Usage Stats
                        </div>
                        <div onClick={() => { this.setState({ selectedTool: [<UsageInDisplay />,] }) }}>
                            Usage Data for Individual Pokemon
                        </div>
                    </div>
                </div>
            </div>
            )
    }
}
ReactDOM.render(
    <SiteDisplay />,
    document.getElementById('root')
);