import baseURL from '../../ambiente/baseURL.js'

var url = baseURL + 'pautista/';
var procuradores;

var pautistaJson = {
  "nome": "",
  "status": "",
  "dataInicial":"",
  "dataFinal":"",
  "grupo":"",
  "saldo": "",
  "peso": ""
}
///////////EXIBIÇÃO ///////////

window.onload = function() {
  axios.get(url).then(response => {
    console.log(response);
    procuradores = response.data;
    
    procuradores.forEach(listar);
  }).catch(error => console.error(error)); 
  sessionStorage.setItem('nome', 'false');
};

function listar(procuradores){

  procuradores.dataInicial = formatarData(procuradores.dataInicial);
  procuradores.dataFinal = formatarData(procuradores.dataFinal);

  var tabela = $('#dataTable').DataTable();
    tabela.row.add( [
      procuradores.nome,
      procuradores.grupoPautista,
      procuradores.statusPautista,
      procuradores.dataInicial,
      procuradores.dataFinal,
      procuradores.saldo,
      procuradores.peso
    ] ).draw( false );
}

//////////// CRUD /////////////
 
function cadastrar(pautistaJson){
  
  console.log(pautistaJson)
  axios.post(url,pautistaJson).then(response =>{
    if(response.status == 200){
      alertar('Pautista foi cadastrado.');
    }
    listar(pautistaJson);
    limparCampos();  
  }).catch(error => console.error(error));
}

function deletar(id){
  var table = $('#dataTable').DataTable();
  axios.delete(url+id).then(response => {
    console.log("response: " + response);
    table.row('.selected').remove().draw( false );
  }).catch(error => console.error(error));
}

////////////UTIL/////////////
function pesquisar(pautistaJson){
  var tabela = $('#dataTable').DataTable();
  var pautistaDaPesquisa; 
  axios.get(url).then(response => {
    var pautistas = response.data;
    pautistaDaPesquisa = pautistas;

    if(pautistaJson.nome){
      pautistaDaPesquisa = pautistas.filter(item =>  item.nome == pautistaJson.nome);
    }
    if(pautistaDaPesquisa && pautistaJson.status){ 
      pautistaDaPesquisa = pautistaDaPesquisa.filter(item =>  item.status == pautistaJson.status);
    }
    if(pautistaDaPesquisa && pautistaJson.grupo){
      
    console.log(pautistaJson.nome);
      pautistaDaPesquisa = pautistaDaPesquisa.filter(item =>  item.grupo == pautistaJson.grupo);
      
      
    console.log(pautistaDaPesquisa);
    }
    if(pautistaDaPesquisa){
      
      tabela.rows().remove().draw(); 
    
      pautistaDaPesquisa.forEach(listar);
    }else{
      tabela.rows().remove().draw();
      pautistas.forEach(listar);
    }
    console.log("Status "+response.status);
      
  }).catch(error => console.error(error)); 
}

function formatarData(LocalDate){
  if(LocalDate !== null){
    if(LocalDate.indexOf("-") == 4 && LocalDate.length == 10){
      LocalDate= LocalDate.substring(8, 10)+"-"+LocalDate.substring(5, 7)+"-"+LocalDate.substring(0, 4);
    }
  }
  
  return LocalDate;
}

function limparCampos(){
  document.getElementById("nome-pautista").value = "";
  document.getElementById("status").value = "";
  document.getElementById("grupo").value = "Preposto";
  document.getElementById("peso").value = "1";
}
//////////// BOTÕES /////////////

$('#cadastrar-pautista').on( 'click', function () {
  
  pautistaJson.nome= document.querySelector('#nome-pautista').value;
  pautistaJson.grupo = document.querySelector('#grupo').value.toUpperCase();
  pautistaJson.peso = document.querySelector('#peso').value;
  pautistaJson.status = "ATIVO";
 
  if(pautistaJson.nome != ""){
    cadastrar(pautistaJson);
  } 
});

function alertar(aviso){
  alert(aviso);
}

$('#editar').on( 'click', function () {
  var table = $('#dataTable').DataTable();
  var pautista = table.row('.selected').data();  
  var nome = pautista[0];
  sessionStorage.setItem('nome', nome);
});

$('#excluir').on('click', function () {

  var table = $('#dataTable').DataTable();
  var pautista = table.row('.selected').data();
  if (pautista){
    $('#popupExcluir').modal();
  }
});

$('#excluirPautista').click(() => {
  var table = $('#dataTable').DataTable();
  var pautista = table.row('.selected').data();
  var nome = pautista[0];  
  pautistaJson = procuradores.filter(item =>  item.nome == nome);
  var id = pautistaJson[0].id;// primeira pauta com o processo pesquisado
  deletar(id);
})

$('#pesquisar').click( function () { 
  var inputNome = document.getElementById("nome-pautista").value.trim();
  pautistaJson.nome = inputNome.toUpperCase()
  pautistaJson.grupo = document.querySelector('#grupo').value.trim();
  pesquisar(pautistaJson);
});