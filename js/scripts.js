google.charts.load('current', {'packages': ['geochart'],});
google.charts.setOnLoadCallback(desenharmapa);

function desenharmapa() {
   
    let data = google.visualization.arrayToDataTable(dadosPais);

    let options = {
        colorAxis: { colors: ['#C3D48B', '#005346'] },
        backgroundColor: '#FFFF'
    }

    let chart = new google.visualization.GeoChart(document.getElementById('meu-mapa'));

    chart.draw(data, options);
}

var dadosPais = [['País', 'Total']];


var dadosGrafico = [
                        ['Status','Total'],
                        ['0',0]
                    ];

async function carregardadosmapa() {
   
    let divErro = document.getElementById('div-Erro');
    divErro.style.display = 'none';

   
    fetch('https://covid19-brazil-api.now.sh/api/report/v1/countries')  
        .then(response => response.json())              
        .then(dados => preparadadosmapa(dados))              
        .catch(e => exibirErro(e.message));            
}

function exibirErro(mensagem) {
    let divErro = document.getElementById('div-Erro');
    divErro.innerHTML = '<b>Erro ao acessar a API</b><br />' + mensagem;
    divErro.style.display = 'block';
}

function preparadadosmapa(dados) {
    dadosGrafico = [
        ['Status','Total']

    ];
    let totalCasos = 0;
    let totalMortes = 0;
    let totalrecuperados = 0;
    for (let i = 0; i< dados['data'].length; i++){
        dadosPais.push([dados['data'][i].country,dados['data'][i].confirmed]);
        totalCasos = totalCasos + dados['data'][i].confirmed;
        totalMortes = totalMortes + dados['data'][i].deaths;
        totalrecuperados = totalrecuperados + dados['data'][i].recovered;
    }
        dadosGrafico.push(['Confirmados',totalCasos]);
        dadosGrafico.push(['Mortes',totalMortes]);
        dadosGrafico.push(['Recuperados',totalrecuperados]);
        console.log(dadosGrafico)
        desenharmapa();
        desenharGraficoPizza();
}






google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(desenharGraficoPizza);

function desenharGraficoPizza() {

    let data = google.visualization.arrayToDataTable( dadosGrafico );

    let options = {
        title: 'Porcentagens',
        is3D: true,
        //pieHole: 0.4
    };

    let chart = new google.visualization.PieChart(document.getElementById('grafico-pizza'));

    chart.draw(data, options);
}

//tabela de dados//

async function carregarDados() {
    //ocultar a div de erro (se ela estiver visível)
    const divErro = document.getElementById('div-Erro');
    divErro.style.display = 'none';

    //chamada a API para obter os dados
    await fetch('https://covid19-brazil-api.now.sh/api/report/v1')//chamando o endereço da API
        .then(Response => Response.json())                   //obtendo a respostace formatando com json
        .then(dados => prepararDados(dados))                 //chamando função para gerar HTML dinâmico
        .catch(e => exibirErro(e.message));                  //exibindo erro na div-erro (se houver)
}


//função para mostrar erro (quando houver)

function exibirErro(mensagem) {
    let divErro = document.getElementById('div-Erro');
    divErro.innerHTML = '<b>Erro ao acessar a API</b><br />' + mensagem;
    divErro.style.display = 'block';
}

//função para preparar os dados e gerar o HTML dinâmico
function prepararDados(dados) {

    //variável para manipular o tbody do html
    let linhas = document.getElementById('linhas');
    linhas.innerHTML = '';

    //laço For para percorrer todos os dados recebidos
    for (let i=0; i<dados['data'].length; i++) {
        let auxLinha = '';

        //linha zebrada
        if (i % 2 != 0)
            auxLinha = '<tr class="listra">';
        else
            auxLinha = '<tr>';

        //Continuar inserindo o código e o nome da moeda
        auxLinha = auxLinha + '<td>' + dados['data'][i].uf + '</td>' +
                              '<td>' +  dados['data'][i].state + '</td>' +
                              '<td>' +  dados['data'][i].cases + '</td>' +
                              '<td>' +  dados['data'][i].deaths + '</td>' +
                              '<td>' +  dados['data'][i].suspects + '</td>' +
                              '<td>' +  dados['data'][i].refuses + '</td>' +
                            '</tr>';

    // Inserindo o html gerado (linha) no innerHTML da TBody
    linhas.innerHTML = linhas.innerHTML + auxLinha;

         
    }

}

document.addEventListener(  "DOMContentLoaded",function(event) {
                               carregardadosmapa()
                               carregarDados()
                            }
);  