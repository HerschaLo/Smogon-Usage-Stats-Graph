import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as smogon from 'smogon-usage-fetch'
import reportWebVitals from './reportWebVitals';
import CanvasJSReact from './canvasjs.react';
import Poke_Ball_icon from './assets/Poke_Ball_icon.png'
import grey_triangle from './assets/grey_triangle.png'
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
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

class PokeChart extends React.Component {
    render() {
        const usageChart = {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: `Generation ${this.props.gen} Pokemon usage rate`
            },
            axisX: {
                interval: 1,
                intervalType: "month",
                title: "Date"
            },
            axisY: {
                title: "Raw usage rate %",
                includeZero: true,
            },
            legend: {
                cursor: "pointer",
                verticalAlign: "top",
                fontSize: 22,
                fontColor: "dimGrey",
            },
            data: []
        }
        let pokemonData = this.props.pokemonData
        let pokeName = this.props.pokeName
        for (let i = 0; i < pokeName.length; i++) {
            usageChart.data.push({
                type: "line",
                showInLegend: true,
                name:pokeName[i],
                indexLabelFontSize: 16,
                dataPoints: [
                ]
            })
        }
        console.log(pokemonData)
        if (pokemonData.length != []) {
            pokemonData.forEach((moveset_data) => {
                for (let i = 0; i < pokeName.length; i++) {
                    if (pokemonData[0][1].data.get(pokeName[i]) != undefined) {
                        usageChart.data[i].dataPoints.push({ x: new Date(2021, moveset_data[0] - 1), y: moveset_data[1].data.get(pokeName[i]).usage * 100 })
                    }
                }
            })
        }
        return (
            <div style={{width:"40vw", border:"2px solid black"}}>
                <CanvasJSChart options={usageChart}/>
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </div>
            )
    }
}
class SiteDisplay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            gen: 8,
            year: "2021",
            rotate: "right",
            sidebar: "sidebar-hide"
        }
    }
    render() {
        return (
            <div style={{display:"flex", flexDriection:"row", width:"100%"}}>
                <div style={{ display: "flex", flexDirection: "row", marginRight: "15px" }}>
                    <div style={{ display: "flex", height: "100vh", alignItems: "center", flexDirection: "column", background: "#e0e0e4" }} className={this.state.sidebar}>
                        <h1>Smogon Usage Stats</h1>
                        <br />
                        <h2>Generations</h2>
                        <div className="gen">
                         <div>
                        <p  onClick={() => { this.setState({ gen: 8, year: "2021" }) }}>
                                    Gen 8 (Sw/SH)
                        </p>
                            </div>
                          <div>
                        <p onClick={() => { this.setState({ gen: 7, year: "2019" }) }}>
                                    Gen 7 (S/M)
                        </p>
                         </div>
                         </div>
                    </div>
                    <div style={{ width: "0.65vw", boxShadow: "2px 2px 4px #000000", background: "#e0e0e4", borderBottomRightRadius: "9px", borderTopRightRadius: "9px", height: "8vh" }}>
                        <img src={grey_triangle} style={{ height: "10px", width: "10px", margin: "1px" }} className={this.state.rotate} onClick={() => {
                            if (this.state.rotate == "right") {
                                this.setState({ rotate: "left", sidebar: "sidebar-show" })
                            }
                            else {
                                this.setState({ rotate: "right", sidebar: "sidebar-hide" })
                            }
                        }} />
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flex:1, border:"1px solid black"}}>
                    <GenDisplay gen={this.state.gen} year={this.state.year} key={ this.state.gen}/>
                </div>
            </div>
                )
    }
}
class GenDisplay extends React.Component {
    constructor(props) {
        super(props)
        console.log("initiated")
        let pokemonData = []
        let counter = 0
        const client = new smogon.SmogonApiClient()
        let dropdown_style = { overflowY: "scroll", height: "120px", width: "200px", position: "relative", display: 'none', width: "175px", marginBottom:"-120px"}
        this.state = {
            pokemonData: pokemonData,
            pokeName: [''],
            dropdown_style: dropdown_style,
            doneLoad: false,
            activeDisplay:-1,
        }
        function fetchData() {
            counter += 1
            client
                .fetchMovesets({ year: this.props.year, month: `0${counter}` }, { name: `gen${this.props.gen}ou` })
                .then((moveset) => {
                    pokemonData.push([counter, moveset])
                    if (counter < 5) {
                        fetchData()
                    }
                    else {
                        console.log(pokemonData)
                        this.setState({doneLoad:true})
                    }
                })
                .catch(console.error)
        }
        fetchData = fetchData.bind(this)
        fetchData()
        this.handleChange = this.handleChange.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.addPokemon = this.addPokemon.bind(this)
        this.deletePokemon = this.deletePokemon.bind(this)
    }
    addPokemon(event) {
        let pokeName = this.state.pokeName
        pokeName.push('')
        console.log(pokeName)
        this.setState({ pokeName: pokeName })
    }
    deletePokemon(index, event) {
        let pokeName = this.state.pokeName
        console.log(index)
        pokeName.splice(index, 1)
        console.log(pokeName)
        this.setState({pokeName:pokeName})
    }
    handleChange(event) {
        let pokeName = this.state.pokeName
        pokeName[this.state.activeDisplay] = event.target.value
        this.setState({ pokeName: pokeName })
        console.log(this.state.pokeName)
    }
    handleBlur(event) {
        setTimeout( ()=> this.setState({ activeDisplay:-1 }) , 100)
    }
    render() {
        let pokemon_names = []
        if (this.state.pokemonData[0]!=undefined){
            this.state.pokemonData[0][1].data.forEach((value, key) => {
                pokemon_names.push(key)
            })
        }
        let loadCheck = {  height:"100vh", display:"flex", flexDirection:"column", alignItems:"center" }
        let pokeLoad = { height:"200px", width:"200px"}
        if (!this.state.doneLoad) {
            loadCheck = { display: 'none', width:"100vw" }
        }
        else {
            pokeLoad.display="none"
        }
        pokemon_names.sort()
        let pokemon_dropdown=[]
        pokemon_names.forEach((name) => {
            let input = new RegExp(this.state.pokeName[this.state.activeDisplay], 'i')
            if (input.exec(name) != null) {
                pokemon_dropdown.push(<p key={name} className="pokemon" onClick={() => {
                    let pokeName = this.state.pokeName
                    pokeName[this.state.activeDisplay] = name
                    this.setState({ pokeName: pokeName })
                }}>
                    {name}
                </p>)
            }
        })
        let search_forms = []
        for (let i = 0; i < this.state.pokeName.length; i++) {
            let margins = { marginTop: "130px", display: "flex" }
            let addPokemon = (<div style={{ marginRight: "20px", width: `130px`}}>
                Select Pokemon:
                <br />
                <button onClick={(e) => this.deletePokemon(i, e)} style={{ marginTop: "10px" }}>Delete</button>
            </div>)
            let dropdown_style = Object.assign({},this.state.dropdown_style)
            if(i==this.state.activeDisplay){
                dropdown_style.display="block"
            }
            if (i == this.state.pokeName.length - 1) {
                addPokemon = (<div style={{ marginRight: "20px", width: `130px` }}>
                    Select Pokemon:
                    <br />
                    <button onClick={(e) => this.deletePokemon(i, e)} style={{marginTop:"10px"}}>Delete</button>
                    <button style={{marginTop:"45px", fontSize:"12px"}} onClick={this.addPokemon}>Add new pokemon</button>
                </div>)
            }
            if (i == 0) {
                margins.marginTop = "10px"
                if (this.state.pokeName.length == 1) {
                    addPokemon = (<div style={{ marginRight: "20px", width: `130px` }}>
                        Select Pokemon:
                        <br />
                        <button style={{ marginTop: "10px", fontSize: "12px" }} onClick={this.addPokemon}>Add new pokemon</button>
                    </div>)
                }
            }
            search_forms.push(<div style={margins}>
                {addPokemon}
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" value={this.state.pokeName[i]} placeHolder={"Type in Pokemon name..."}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            onSelect={() => {
                                setTimeout(() => {
                                    this.setState({ activeDisplay: i })
                                    console.log(this.state.activeDisplay)
                                    console.log(this.state.pokeName)
                                },105
                            )
                        }}
                        style={{ width: "175px" }} />
                    </form>
                    <div style={dropdown_style}>
                        {pokemon_dropdown}
                    </div>
                </div>
             </div>)
        }
        return (
            <div style={{height:"100vh",display:'flex',justifyContent:'center', alignItems:'center'}}>
                <img src={Poke_Ball_icon} className="loading" style={pokeLoad} />

                <div style={loadCheck}>
                    <div style={{ display:"flex", flex: 9, flexDirection:"column"}}>
                        <PokeChart pokemonData={this.state.pokemonData} pokeName={this.state.pokeName} gen={this.props.gen } style={{ height: "150px", border:"2px solid black" }}/>
                        {search_forms}
                    </div>
                </div>
            </div>
            )
    }
}

// ========================================

ReactDOM.render(
    <SiteDisplay />,
    document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
