import baseURL from '../../ambiente/baseURL.js'


var procuradores = [];
var procuradores = [];

window.onload = function () {
  getMutirao();
  pegarProcuradores();
};

//define a contagem de pautistas automatico na pagina index
function pegarProcuradores() {
  axios.get(baseURL + 'pautista/').then(response => {
    var lista = response.data;
    document.getElementById("totalPautista").innerHTML = lista.length;
    lista.forEach(function (procurador) {
      procurador.saldo = parseInt(procurador.saldo);
      procuradores.push(procurador);
    });
    exibirTabelaPautista(procuradores);
  }).catch(error => console.error(error));
}

function exibirTabelaPautista(procuradores) {

  var theadPautista = '<tr class="table-success"> ' +
    '<th style="padding-right: 20px;" scope="col">' + "PAUTISTAS" + '</th>' +
    '<th scope="col"> QUANTIDADE DE AUDIÊNCIAS</th>' +
    '</tr>';

  var tbody;
  $('#theadPautista').html(theadPautista).show();
  fetch(baseURL + 'pauta/total', { method: 'GET' }).then(response => {
    let maxElements = response.headers.get('maxElements');
    tbody = '<tr> <td>TODOS</td> <td>' + maxElements + '</td> </tr>';
    $.each(procuradores, function (i, obj) {
      if (obj) {
        tbody += '<tr> <td>' + obj.nome + '</td> <td>' + obj.saldo + '</td> </tr>';
      }
    })
    $('#tbodyPautista').html(tbody).show();
  }).catch(error => console.error(error));
}

function getMutirao() {
  axios.get(baseURL + 'mutirao/').then(response => {
    $('#totalMutirao').html(response.data.length).show();
  }).catch(error => console.error(error));

}
