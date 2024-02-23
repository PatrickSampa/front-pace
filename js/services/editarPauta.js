import baseURL from '../../ambiente/baseURL.js'

var url = baseURL + 'pauta';
var processo;

var pautaJson = {
  "id": "",
  "data": "",
  "hora": "",
  "turno": "",
  "sala": "",
  "processo": "",
  "nomeParte": "",
  "cpf": "",
  "nomeAdvogado": "",
  "objeto": "",
  "vara": ""
}

window.onload = function () {
  processo = sessionStorage.getItem('processo');
  axios.get(url + "/processo", { params: { processo: processo } }).then(response => {
    pautaJson = response.data;
    document.getElementById("data-pauta").value = pautaJson.data;
    document.getElementById("hora-pauta").value = pautaJson.hora;
    document.getElementById("turno-pauta").value = pautaJson.turno;
    document.getElementById("sala-pauta").value = pautaJson.sala;
    document.getElementById("processo").value = pautaJson.processo;
    document.getElementById("nome-parte").value = pautaJson.nomeParte;
    document.getElementById("cpf-pauta").value = pautaJson.cpf;
    document.getElementById("nome-advogado").value = pautaJson.nomeAdvogado;
    document.getElementById("objeto").value = pautaJson.objeto;
    document.getElementById("vara").value = pautaJson.vara;
    document.getElementById("tipo").value = pautaJson.tipo.toUpperCase();
  }).catch(error => console.error(error));
};


$('#salvar-editado').click(function () {
  pautaJson.processo = document.querySelector('#processo').value.trim();
  pautaJson.data = document.querySelector('#data-pauta').value;
  pautaJson.hora = document.querySelector('#hora-pauta').value.trim();
  pautaJson.turno = document.querySelector('#turno-pauta').value.trim();
  pautaJson.sala = document.querySelector('#sala-pauta').value.trim();
  pautaJson.processo = document.querySelector('#processo').value.trim();
  pautaJson.nomeParte = document.querySelector('#nome-parte').value.trim();
  pautaJson.cpf = document.querySelector('#cpf-pauta').value.trim();
  pautaJson.nomeAdvogado = document.querySelector('#nome-advogado').value.trim();
  pautaJson.objeto = document.querySelector('#objeto').value.trim();
  var vara = document.getElementById('vara');
  pautaJson.vara = vara.options[vara.selectedIndex].value;
  var tipo = document.getElementById('tipo');
  pautaJson.tipo = tipo.options[tipo.selectedIndex].value;
  if (pautaJson.processo == "") {
    console.log("Processo não pode ser nulo")
  } else {
    pautaJson.processo = pautaJson.processo.replace(/\D/g, "");
    editar(pautaJson);
  }
});

function editar(pauta) {
  axios.put(url + pauta.id, pauta).then(response => {
    console.log(response.status);
    window.history.back();
  }).catch(error => console.error(error));
}