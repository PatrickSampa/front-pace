import baseURL from '../../ambiente/baseURL.js'

let pauta;
let processo;
let data;
let procuradores = [];

window.onload = function () {
  processo = sessionStorage.getItem('processo');
  data = sessionStorage.getItem('data');
  axios.get(baseURL + 'pauta/processo?processo=' + processo + "&data=" + data).then(response => {
    pauta = response.data;
    document.getElementById("data-pauta").value = pauta.data;
    document.getElementById("hora-pauta").value = pauta.hora;
    document.getElementById("sala-pauta").value = pauta.sala;
    document.getElementById("processo").value = pauta.processo;
    document.getElementById("pautista").value = pauta.pautista.nome;
    axios.get(baseURL + 'pautista/disponiveis?data=' + pauta.data).then(response => {
      let lista = response.data;
      lista.forEach(function (procurador) {
        procuradores.push(procurador);
      });
      selectPautistas(procuradores);
    }).catch(error => console.error(error));
  }).catch(error => console.error(error));
};

$('#salvar-editado').click(function () {
  var selectPautista = document.getElementById('pautista');
  selectPautista = selectPautista.options[selectPautista.selectedIndex].value;
  if (processo != "") {
    axios.put(baseURL + "mutirao/" + pauta.id + "/" + selectPautista).then(response => {
      window.history.back();
    }).catch(error => console.error(error));
  }
});

function selectPautistas(procuradores) {
  if (procuradores) {
    let option;
    $.each(procuradores, function (i, obj) {
      option += '<option value="' + obj.id + '">' + obj.nome + '</option>';
    })
    $('#pautista').html(option).show();
  }
}