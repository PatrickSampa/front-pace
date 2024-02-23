import baseURL, { baseVisaoURL } from '../../ambiente/baseURL.js'

let pautas;
let contPage = 0;
let maxElements;
let isLogin = true;
let toCsv = [];

window.onload = function () {
  onChangeInputs();
  listarVaras();
  fetch(baseURL + 'pauta/filtro?page=0&size=10', { method: "GET" }).then(response => {
    response.json().then(response => {
      maxElements = response.totalElements;
      document.getElementById("total").innerHTML = "Resultados totais: " + maxElements;
      document.getElementById("pageInfo").innerHTML = "Página " + (response.pageable.pageNumber + 1) + " de " + response.totalPages;
      pautas = response.content;
      pautas.forEach(listar);
      document.getElementById("botaoAnterior").setAttribute("disabled", "disabled");
      if (response.pageable.pageNumber + 1 == response.totalPages) {
        document.getElementById("botaoProximo").setAttribute("disabled", "disabled");
      }
    }).catch(error => console.error(error));
  }).catch(error => console.error(error));

  axios.get(baseURL + 'pautista/').then(response => {
    let option = '<option>Todos os pautistas</option>';
    let lista = response.data;
    if (lista) {
      lista.forEach((procurador) => {
        option += '<option value="' + procurador.id + '">' + procurador.nome + '</option>';
      })
      $('#pautista').html(option).show();
    }
  }).catch(error => console.error(error));
};

function listarVaras() {
  axios.get(baseURL + 'mutirao/').then(response => {
    var mutirao = response.data;
    var option = '<option>Todas as varas</option>';
    let varaRepetida = [];
    for (let i of mutirao) {
      if (varaRepetida.indexOf(i.vara) === -1) {
        if (i.status == "COM_ESCALA") {
          option += '<option value="' + i.vara + '">' + i.vara + '</option>';
        }
      }
      $('#vara').html(option).show();
    }
  }).catch(error => console.error(error));
}

function listar(pauta) {
  const tarefaSapiens = pauta.tarefaSapiens === 'CADASTRADA' ? 'Cadastrada' : 'Não Cadastrada';
  pauta.data = formatarData(pauta.data, "-");
  let tabela = $('#dataTablePesquisa').DataTable();

  tabela.row.add([
    pauta.data,
    pauta.hora,
    pauta.turnoPauta,
    pauta.sala,
    pauta.vara,
    pauta.processo,
    pauta.nomeParte,
    tarefaSapiens,
    pauta.pautista.nome,
  ]).draw(false);
}

function onChangeInputs(){
  const divForm = document.getElementById('formFiltrosEscala');
  const inputs = divForm.querySelectorAll('.form-control, .custom-select');
  console.log(inputs);

  inputs.forEach(input =>{
    input.addEventListener('input', () =>{
      let btnTarefa = document.getElementById("btnTarefas"); 
      btnTarefa.disabled = true;
    })
  })

}

$("#botaoProximo").on("click", function () {
  let pages = document.getElementById("botaoSelecionado").innerText;
  if (document.getElementById("botaoSelecionado").innerText == "tudo") {
    pages = 0;
    document.getElementById("botaoSelecionado").innerText = "tudo";
  }
  let requestParams = "?";
  let tabela = $('#dataTablePesquisa').DataTable();
  contPage++;

  tabela.clear().draw();
  requestParams += "page=" + contPage + "&size=" + pages;

  if (document.getElementById('data').value) {
    requestParams += "&dataInicial=" + document.getElementById('data').value
  }
  if (document.getElementById('hora').value.trim()) {
    requestParams += "&hora=" + document.getElementById('hora').value.trim()
  }
  if (document.getElementById('sala').value.trim()) {
    requestParams += "&sala=" + document.getElementById('sala').value.trim()
  }
  if (document.getElementById('data2').value) {
    requestParams += "&dataFinal=" + document.getElementById('data2').value
  }
  if (!document.getElementById('vara').value || document.getElementById('vara').value !== "Todas as varas") {
    requestParams += "&vara=" + document.getElementById('vara').value
  }
  if (!document.getElementById('pautista').value || document.getElementById('pautista').value !== "Todos os pautistas") {
    requestParams += "&pautista=" + document.getElementById('pautista').value
  }
  fetch(baseURL + 'pauta/filtro' + requestParams, { method: "GET" })
    .then(response => response.json())
    .then(response => {
      document.getElementById("pageInfo").innerHTML = "Página " + (response.pageable.pageNumber + 1) + " de " + response.totalPages;
      document.getElementById("botaoAnterior").removeAttribute("disabled");
      if (response.pageable.pageNumber + 1 == response.totalPages) {
        document.getElementById("botaoProximo").setAttribute("disabled", "disabled");
      }
      pautas = response.content;
      pautas.forEach(listar);
    }).catch(error => console.error(error));
})

$("#botaoAnterior").on("click", function () {
  let pages = document.getElementById("botaoSelecionado").innerText;
  if (document.getElementById("botaoSelecionado").innerText == "tudo") {
    pages = 0;
    document.getElementById("botaoSelecionado").innerText = "tudo";
  }
  let requestParams = "?";
  let tabela = $('#dataTablePesquisa').DataTable();
  contPage--;

  tabela.clear().draw();
  requestParams += "page=" + contPage + "&size=" + pages;

  if (document.getElementById('data').value) {
    requestParams += "&dataInicial=" + document.getElementById('data').value
  }
  if (document.getElementById('hora').value.trim()) {
    requestParams += "&hora=" + document.getElementById('hora').value.trim()
  }
  if (document.getElementById('sala').value.trim()) {
    requestParams += "&sala=" + document.getElementById('sala').value.trim()
  }
  if (document.getElementById('data2').value) {
    requestParams += "&dataFinal=" + document.getElementById('data2').value
  }
  if (!document.getElementById('vara').value || document.getElementById('vara').value !== "Todas as varas") {
    requestParams += "&vara=" + document.getElementById('vara').value
  }
  if (!document.getElementById('pautista').value || document.getElementById('pautista').value !== "Todos os pautistas") {
    requestParams += "&pautista=" + document.getElementById('pautista').value.trim();
  }
  fetch(baseURL + 'pauta/filtro' + requestParams, { method: "GET" })
    .then(response => response.json())
    .then(response => {
      document.getElementById("pageInfo").innerHTML = "Página " + (response.pageable.pageNumber + 1) + " de " + response.totalPages;
      document.getElementById("botaoProximo").removeAttribute("disabled");
      if (response.pageable.pageNumber == 0) {
        document.getElementById("botaoAnterior").setAttribute("disabled", "disabled");
      }
      pautas = response.content;
      pautas.forEach(listar);
    }).catch(error => console.error(error));
})

$("#cem, #cinquenta, #dez, #tudo").on("click", function () {
  let requestParams = "?";
  let tabela = $('#dataTablePesquisa').DataTable();
  let pages = this.innerText;
  contPage = 0;
  document.getElementById("botaoSelecionado").innerText = pages;
  if (this.innerText == "tudo") {
    pages = 0;
    document.getElementById("botaoSelecionado").innerText = "tudo";
  }

  document.getElementById("botaoAnterior").setAttribute("disabled", "disabled");
  document.getElementById("botaoProximo").removeAttribute("disabled");

  tabela.clear().draw();
  requestParams += "page=" + contPage + "&size=" + pages;


  if (document.getElementById('data').value) {
    requestParams += "&dataInicial=" + document.getElementById('data').value
  }
  if (document.getElementById('hora').value.trim()) {
    requestParams += "&hora=" + document.getElementById('hora').value.trim()
  }
  if (document.getElementById('sala').value.trim()) {
    requestParams += "&sala=" + document.getElementById('sala').value.trim()
  }
  if (document.getElementById('data2').value) {
    requestParams += "&dataFinal=" + document.getElementById('data2').value
  }
  if (!document.getElementById('vara').value || document.getElementById('vara').value !== "Todas as varas") {
    requestParams += "&vara=" + document.getElementById('vara').value
  }
  if (!document.getElementById('pautista').value || document.getElementById('pautista').value !== "Todos os pautistas") {
    requestParams += "&pautista=" + document.getElementById('pautista').value.trim();
  }

  fetch(baseURL + 'pauta/filtro' + requestParams, { method: "GET" }).then(response => {

    response.json().then(response => {
      maxElements = response.totalElements;
      document.getElementById("pageInfo").innerHTML = "Página " + (response.pageable.pageNumber + 1) + " de " + response.totalPages;
      document.getElementById("total").innerHTML = "Resultados totais: " + maxElements;
      if (response.pageable.pageNumer + 1 == response.totalPages) {
        document.getElementById("botaoProximo").setAttribute("disabled", "disabled");
      }
      else if (response.totalPages === 1) {
        document.getElementById("botaoProximo").setAttribute("disabled", "disabled");
        document.getElementById("pageInfo").innerHTML = "Página 1 de 1";
      }
      pautas = response.content;
      pautas.forEach(listar);
    }).catch(error => console.error(error));

  })
})

function formatarData(LocalDate, char) {
  if (LocalDate !== null) {
    if (LocalDate.indexOf("-") == 4 && LocalDate.length == 10) {
      LocalDate = LocalDate.substring(8, 10) + char + LocalDate.substring(5, 7) + char + LocalDate.substring(0, 4);
    } else {
      if (LocalDate.indexOf("-") == 2 && LocalDate.length == 10) {
        LocalDate = LocalDate.substring(6, 10) + char + LocalDate.substring(3, 5) + char + LocalDate.substring(0, 2);
      }
    }
  }

  return LocalDate;
}

//////////BOTÕES////////////

$('#editar').click(function () {
  var table = $('#dataTablePesquisa').DataTable();
  pautas = table.row('.selected').data();
  if (pautas) {
    var processo = pautas[5];
    var data = pautas[0];
  }
  data = formatarData(data, "-");
  sessionStorage.setItem('data', data);
  sessionStorage.setItem('processo', processo);
});

$('#btn-cadastro-tarefa').click( async function () {
  if(isLogin){
    const login = {
      cpf:document.getElementById('cpf-input').value,
      senha:document.getElementById('senha-input').value,
    }
  
    await axios.post((baseVisaoURL + '/samir/login'), login).then( data => {
       if(data.data === 'Acesso negado, verifique se o CPF e a senha est�o corretos!'){
          alert('Cpf e/ou senha incorretos');
       }else{
        localStorage.setItem('login',JSON.stringify(login));
        const formCadastro = document.getElementById('form-content-popup-cadastro');
        const formLogin = document.getElementById('form-content-popup-login');
        const btnPopup =  document.getElementById('btn-cadastro-tarefa');
        btnPopup.innerText = 'Cadastrar';
        formLogin.classList.add('d-none');
        formCadastro.classList.remove('d-none');
        isLogin = false;
       }
    });
  }else{

    const fieldEtiqueta = document.getElementById('input-etiqueta');
    const fieldSetorResponsavel = document.getElementById('input-setor-responsavel');
    const fieldEspecieTarefa = document.getElementById('input-especie-tarefa');

    const setorResponsavel = fieldSetorResponsavel.value.split("-")[0].trim();
    const especieTarefa = fieldEspecieTarefa.value.split("-")[0].trim();

    document.getElementById('loading').classList.remove('d-none');

    const data = {
      login: JSON.parse(localStorage.getItem('login')),
      etiqueta: fieldEtiqueta.value,
      especieTarefa: Number(especieTarefa),
      setorResponsavel: Number(setorResponsavel),
      filtroPautas: formatarFiltros(JSON.parse(localStorage.getItem('filtroPautas'))),
    }
    
    await axios.post(baseURL + 'pauta/cadastroTarefas', data)
    .then(response => {
      document.getElementById('loading').classList.add('d-none');
      const icon = document.getElementById('icon-msg-popup');
      const infoSpan = document.getElementById('info-msg');

      if(response.status === 204) {
        icon.style.color = 'green';
        icon.innerText = 'check_circle';

        infoSpan.innerText = 'Tarefas cadastradas com sucesso';

      }else{
        icon.style.color = 'red';
        icon.innerText = 'error';
        infoSpan.innerText = 'Erro';

        const div = document.createElement('div');
        div.classList.add('overflow-auto');
        div.id = 'processos-nao-encontrados';
        const processosNaoEncontrados = response.data;
        for (const pauta of processosNaoEncontrados) {
          const p = document.createElement('p');
          p.innerText = pauta.processo;

          div.appendChild(p);
        }

        infoSpan.appendChild(div);
        
      }
      
      $('#infoPopup').modal('show');
      
    }).catch(async e =>{
      setTimeout(() => {
        document.getElementById('loading').classList.add('d-none');
        console.error(e);
        const icon = document.getElementById('icon-msg-popup');
        icon.style.color = 'red';
        icon.innerText = 'error';
        const infoSpan = document.getElementById('info-msg');
        infoSpan.innerText = 'Erro ao cadastrar tarefas'
        $('#infoPopup').modal('show');
      }, 1000);
      
    });

  }
  
});

$('#btnTarefas').on('click', async function(e){
  const filtro = JSON.parse(localStorage.getItem('filtroPautas'));
  let tabela = $('#dataTablePesquisa').DataTable();
  let primeiraLinha = tabela.row(0).data();
  let colunaStatusTarefa;

  for (const coluna of primeiraLinha) {
      if(coluna === 'Cadastrada'){
        colunaStatusTarefa = coluna;
        break;
      }
  }

  if (filtro.statusTarefa === 'Cadastrada') {
    $('#confirm-popup').modal('show');
  }else if (filtro.statusTarefa === 'Todos' && colunaStatusTarefa){
    $('#confirm-popup').modal('show');
  }else{
    $('#myModal').modal('show');
  }
});

$('#abrirProximoPopup').on('click', async function(e){
  $('#confirm-popup').modal('hide');
  $('#myModal').modal('show');
});

function popupMsg(msg){

}

function formatarFiltros(filtros){  
  for (const atributo in filtros) {
    if(filtros[atributo] === "" || filtros[atributo] === "Todos os pautistas" || filtros[atributo] === "Todas as varas"){
      filtros[atributo] = null;
    }
    if(filtros[atributo] === 'Todos'){
      filtros[atributo] = 'TODOS';
    }
    if(filtros[atributo] === 'Cadastrada'){
      filtros[atributo] = 'CADASTRADA'  ;
    }
    if(filtros[atributo] === 'Não Cadastrada'){
      filtros[atributo] = 'NAO_CADASTRADA';
    }
  }

  return filtros;
}


$('#input-especie-tarefa').on('input', async function(e){
  const url = (baseVisaoURL + '/pano/getEspecieTarefa');
      const itemPesquisa = e.target.value;
      const searchResultsEspecieTarefa = document.getElementById('search-results-especie-tarefa');
      const especieTarefaField = document.getElementById('input-especie-tarefa');

      //limpando resultados
      searchResultsEspecieTarefa.innerHTML = '';

      const data = {
          login: JSON.parse(localStorage.getItem('login')),
          query: itemPesquisa
      } 

      if(itemPesquisa.trim() === ''){
        $('#searchResults').style.display = 'none';
      }else{
        searchResultsEspecieTarefa.style.display = 'block';
        let responseCodes = [] ;
        const response = await axios.post(url, data);
        responseCodes =  response.data;

        searchResultsEspecieTarefa.innerHTML = '';

        for (const {id,nome} of responseCodes) {
          const divResult = document.createElement('div');
          divResult.classList.add('searchResults-item');
          divResult.innerText = `${id}: ${nome}`;
          divResult.addEventListener('click', () => {
            especieTarefaField.value = `${id} - ${nome}`;
            searchResultsEspecieTarefa.innerHTML = '';
            searchResultsEspecieTarefa.style.display = 'none';
          });
          searchResultsEspecieTarefa.appendChild(divResult);
        }
      }

      

});

$('#input-setor-responsavel').on('input', async function(e){
  const url = (baseVisaoURL + '/pano/getSetorResponsavelTarefa');
  const itemPesquisa = e.target.value;
  const searchResultsSetorResponsavel = document.getElementById('search-results-setor-responsavel');
  const setorResponsavelField = document.getElementById('input-setor-responsavel');

  //limpando resultados
  searchResultsSetorResponsavel.innerHTML = '';

  const data = {
      login: JSON.parse(localStorage.getItem('login')),
      query: itemPesquisa
  } 

  if(itemPesquisa.trim() === ''){
    $('#search-results-setor-responsavel').style.display = 'none';
  }else{
    searchResultsSetorResponsavel.style.display = 'block';
    let responseCodes = [] ;
    const response = await axios.post(url, data);
    responseCodes =  response.data;

    searchResultsSetorResponsavel.innerHTML = '';

    for (const {id,nome} of responseCodes) {
      const divResult = document.createElement('div');
      divResult.classList.add('searchResults-item');
      divResult.innerText = `${id}: ${nome}`;
      divResult.addEventListener('click', () => {
        setorResponsavelField.value = `${id} - ${nome}`;
        searchResultsSetorResponsavel.innerHTML = '';
        searchResultsSetorResponsavel.style.display = 'none';
      });
      searchResultsSetorResponsavel.appendChild(divResult);
    }
  }
});

// $('#input-especie-tarefa').on('blur', async function(){
//   const divResults = document.getElementById('searchResults');
//   divResults.style.display = 'none';
// });

document.addEventListener('click', (event) => {
  const especieTarefaField = document.getElementById('input-especie-tarefa');
  const setorResponsavelField = document.getElementById('input-setor-responsavel');

  const isClickInsideFieldTarefa = especieTarefaField.contains(event.target);
  const isClickInsideFieldSetor = setorResponsavelField.contains(event.target);

  const searchResultsEspecieTarefa = document.getElementById('search-results-especie-tarefa');
  const searchResultsSetorResponsavel = document.getElementById('search-results-setor-responsavel');


  
  if (!isClickInsideFieldTarefa || !isClickInsideFieldSetor) {
    searchResultsEspecieTarefa.style.display = 'none';
    searchResultsEspecieTarefa.innerHTML = '';

    searchResultsSetorResponsavel.style.display = 'none';
    searchResultsSetorResponsavel.innerHTML = '';
    // searchResultsSetorResponsavel.style.display = 'none';
  }
});

$('#myModal').on('hidden.bs.modal', function() {
  
  $('#form-content-popup-login').removeClass('d-none');
  $('#form-content-popup-cadastro').addClass('d-none');

  $('#cpf-input').val('');
  $('#senha-input').val('');
  $('#input-etiqueta').val('');
  $('#input-setor-responsavel').val('');
  $('#input-especie-tarefa').val('');
  $('#btn-cadastro-tarefa').text('Login');

  //reinicia o evento de login
  isLogin = true;
});



$('#pesquisar').click(function () {

  let btnTarefa = document.getElementById("btnTarefas"); 
  btnTarefa.disabled = false;
  let pages = document.getElementById("botaoSelecionado").innerText;
  if (document.getElementById("botaoSelecionado").innerText == "tudo") {
    pages = 0;
    document.getElementById("botaoSelecionado").innerText = "tudo";
  }
  let requestParams = "?";
  contPage = 0;
  requestParams += "page=" + contPage;
  document.getElementById("botaoAnterior").setAttribute("disabled", "disabled");
  document.getElementById("botaoProximo").removeAttribute("disabled");

  requestParams += "&size=" + pages;
  var tabela = $('#dataTablePesquisa').DataTable();
  tabela.clear().draw();

  //salvando objeto de filtros
  
  const filtroPautas = {
    dataInicial: document.getElementById('data').value,
    dataFinal: document.getElementById('data2').value,
    hora: document.getElementById('hora').value.trim(),
    vara: document.getElementById('vara').value,
    sala: document.getElementById('sala').value.trim(),
    pautista: document.getElementById('pautista').value.trim(),
    statusTarefa: document.getElementById('status-tarefa').value,
    page:0,
    size:25
  }

  localStorage.setItem('filtroPautas', JSON.stringify(filtroPautas));

  if (document.getElementById('data').value) {
    requestParams += "&dataInicial=" + document.getElementById('data').value
  }
  if (document.getElementById('hora').value.trim()) {
    requestParams += "&hora=" + document.getElementById('hora').value.trim()
  }
  if (document.getElementById('sala').value.trim()) {
    requestParams += "&sala=" + document.getElementById('sala').value.trim()
  }
  if (document.getElementById('data2').value) {
    requestParams += "&dataFinal=" + document.getElementById('data2').value
  }
  if (!document.getElementById('vara').value || document.getElementById('vara').value !== "Todas as varas") {
    requestParams += "&vara=" + document.getElementById('vara').value
  }
  if (!document.getElementById('pautista').value || document.getElementById('pautista').value !== "Todos os pautistas") {
    requestParams += "&pautista=" + document.getElementById('pautista').value.trim();
  }

  if (document.getElementById('status-tarefa').value !== 'Todos') {
    const statusTarefa = (document.getElementById('status-tarefa').value === "Cadastrada") ?  'CADASTRADA' : 'NAO_CADASTRADA';
    requestParams += "&statusTarefa=" + statusTarefa;
  }

  console.log(requestParams);

  fetch(baseURL + 'pauta/filtro' + requestParams, { method: "GET" }).then(response => {

    response.json().then(response => {
      maxElements = response.totalElements;
      document.getElementById("pageInfo").innerHTML = "Página " + (response.pageable.pageNumber + 1) + " de " + response.totalPages;
      document.getElementById("total").innerHTML = "Resultados totais: " + maxElements;
      if (response.pageable.pageNumber + 1 == response.totalPages) {
        document.getElementById("botaoProximo").setAttribute("disabled", "disabled");
      }
      pautas = response.content;
      pautas.forEach(listar);
    }).catch(error => console.error(error));

  });
});

$('#print-escala').click(function () {
  $("#gerandoModal").modal({ backdrop: 'static', keyboard: false });
  $("#gerandoModal").modal("show");
  let requestParams = "?";
  requestParams += "page=" + 0;
  requestParams += "&size=" + 0;

  if (document.getElementById('data').value) {
    requestParams += "&dataInicial=" + document.getElementById('data').value
  }
  if (document.getElementById('hora').value.trim()) {
    requestParams += "&hora=" + document.getElementById('hora').value.trim()
  }
  if (document.getElementById('sala').value.trim()) {
    requestParams += "&sala=" + document.getElementById('sala').value.trim()
  }
  if (document.getElementById('data2').value) {
    requestParams += "&dataFinal=" + document.getElementById('data2').value
  }
  if (!document.getElementById('vara').value || document.getElementById('vara').value !== "Todas as varas") {
    requestParams += "&vara=" + document.getElementById('vara').value
  }
  if (!document.getElementById('pautista').value || document.getElementById('pautista').value !== "Todos os pautistas") {
    requestParams += "&pautista=" + document.getElementById('pautista').value.trim();
  }
  fetch(baseURL + 'pauta/filtro' + requestParams, { method: "GET" }).then(response => {
    response.json().then(response => {

      pautas = response.content;
      pautas.forEach(formatarCsv);
      var array = typeof toCsv != 'object' ? JSON.parse(toCsv) : toCsv;
      var str = 'sep=,\r\n' + 'Data,Hora,Turno,Sala,Vara,Processo,Nome da Parte,Status Tarefa Sapiens,Pautista\r\n';
      for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
          line += array[i][index] + ',';
        }
        line.slice(0, line.Length - 1);
        str += line + '\r\n';
      }
      toCsv = [];
      new Promise(r => setTimeout(r, 500)).then(() => {
        $("#gerandoModal").modal("hide");
        let uri = 'data:text/csv;charset=utf-8,' + escape(str);
        let downloadLink = document.createElement("a");
        downloadLink.href = uri;
        downloadLink.download = "pautasPACE.csv";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });

    }).catch(error => console.error(error));

  });
});

function formatarCsv(pautas) {
  let json = {
    "data": '',
    "hora": '',
    "turno": '',
    "sala": '',
    "vara": '',
    "processo": '',
    "nomeParte": '',
    "statusTarefaSapiens": '',
    "pautista": ''
  };
  const tarefaSapiens = pautas.tarefaSapiens === 'CADASTRADA' ? 'Cadastrada' : 'Não Cadastrada';
  json.data = formatarData(pautas.data, "-");
  json.hora = pautas.hora;
  json.turno = pautas.turnoPauta;
  json.sala = pautas.sala;
  json.vara = pautas.vara;
  json.processo = pautas.processo;

  json.nomeParte = pautas.nomeParte;
  json.statusTarefaSapiens = tarefaSapiens;
  json.pautista = pautas.pautista.nome;
  toCsv.push(json);
}