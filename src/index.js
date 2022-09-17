import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { EstacaoClimatica } from './EstacaoClimatica'
import Loading from './Loading'
class App extends React.Component {

  constructor(props) {
    super(props)
    console.log('construtor')
  }

  state = {
    latitude: null,
    longitude: null,
    estacao: null,
    data: null,
    icone: null,
    mensagemDeErro: null
  }

  componentDidMount() {
    this.obterLocalizacao()
  }

  obterEstacao = (data, latitude) => {
    const anoAtual = data.getFullYear()
    //new Date(ano,mês(0 a 11), dia (1, 31))
    //21/06
    const d1 = new Date(anoAtual, 5, 21)
    //24/09
    const d2 = new Date(anoAtual, 8, 24)
    //22/12
    const d3 = new Date(anoAtual, 11, 22)
    //21/03
    const d4 = new Date(anoAtual, 2, 21)
    const sul = latitude < 0
    if (data >= d1 && data < d2)
      return sul ? 'Inverno' : 'Verão'
    if (data >= d2 && data < d3)
      return sul ? 'Primavera' : 'Outono'
    if (data >= d3 && data < d4)
      return sul ? 'Verão' : 'Inverno'
    return sul ? 'Outono' : 'Primavera'
  }

  icones = {
    'Primavera': 'fa-seedling',
    'Verão': 'fa-umbrella-beach',
    'Outono': 'fa-tree',
    'Inverno': 'fa-snowman'
  }

  obterLocalizacao = () => {
    window.navigator.geolocation.getCurrentPosition(
      (posicao) => {
        let data = new Date()
        let estacao = this.obterEstacao(data, posicao.coords.latitude);
        let icone = this.icones[estacao]
        this.setState(
          {
            latitude: posicao.coords.latitude,
            longitude: posicao.coords.longitude,
            estacao: estacao,
            data: data.toLocaleTimeString(),
            icone: icone
          },
          (erro) => {
            console.log(erro)
            this.setState({ mensagemDeErro: `Tente novamente mais tarde (Try again later)` })
          }
        )
      }
    )
  }

  render(){
    return (
      <div className="container mt-2">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {
              !this.state.latitude && !this.state.mensagemDeErro ?
              <Loading/>
              :
              this.state.mensagemDeErro ?
              <p className='border rounded p-2 fs-1 text-center'>
                É preciso dar permissão para acesso à localização.
                Atualize a página e tente de novo, ajustando a configuração do seu navegador.
              </p>
              :
             <EstacaoClimatica 
              icone={this.state.icone}
              estacao={this.state.estacao}
              latitude={this.state.latitude}
              longitude={this.state.longitude}
              obterLocalizacao={this.obterLocalizacao}
             />
            }
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.querySelector('#root')
)