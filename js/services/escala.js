import baseURL from '../../ambiente/baseURL.js'

let mutiroesSemEscala = [];
let pautas = {
  "id": "",
  "data": "",
  "hora": "",
  "sala": "",
  "processo": "",
  "nomeParte": "",
  "cpf": "",
  "nomeAdvogado": "",
  "objeto": "",
  "vara": "",
  "tipoPauta": "",
  "turnoPauta": "",
  "pautista": {},
  "mutirao": ""
}

let pauta;

window.onload = function () {
  listarVaras();
};

function listarVaras() {
  axios.get(baseURL + 'mutirao/').then(response => {
    var mutirao = response.data;
    muti(mutirao);
    getMutirao();
    if (document.getElementById("mutirao").options.length !== 0) {

      axios.get(baseURL + "mutirao/" + document.getElementById("mutirao").value + '/pautas').then(response => {
        pautas = response.data;
        pautas.forEach(listar);
      }).catch(error => console.error(error));
    }
  }).catch(error => console.error(error));
}

function listar(pautas) {

  pautas.data = formatarData(pautas.data, "-");
  var tabela = $('#dataTable').DataTable();
  tabela.row.add([
    pautas.data,
    pautas.hora,
    pautas.turno,
    pautas.sala,
    pautas.vara,
    pautas.processo,
    pautas.nomeParte,
    pautas.nomeAdvogado,
    pautas.objeto,

  ]).draw(false);

  var tabela = $('#dataTablePesquisa').DataTable();
  tabela.row.add([
    pautas.data,
    pautas.hora,
    pautas.turno,
    pautas.sala,
    pautas.vara,
    pautas.processo,
    pautas.nomeParte,
    pautas.nomeAdvogado,
    pautas.objeto,

  ]).draw(false);
}
/////////////UTIL//////////////


function getMutirao() {
  let option;
  var vara = document.getElementById('vara');

  if (vara.options.length !== 0) {

    vara = vara.options[vara.selectedIndex].value;
    mutiroesSemEscala.forEach(obj => {
      if (obj.vara === vara) {
        option += '<option value="' + obj.id + '">' + formatarData(obj.dataInicial, "/") + ' a ' + formatarData(obj.dataFinal, "/") + '</option>';
      }
    })
    $("#mutirao").html(option).show();
    exibirBtnGerar();
  }
}



function muti(mutiroes) {
  var option;
  let varasSemEscala = [];

  $.each(mutiroes, function (i, obj) {
    if (obj.status === "SEM_ESCALA") {
      mutiroesSemEscala.push(obj);
      if (varasSemEscala.indexOf(obj.vara) === -1) {
        varasSemEscala.push(obj.vara);
      }
    }
  })
  if (varasSemEscala) {
    varasSemEscala.forEach(value => {
      option += '<option value="' + value + '">' + value + '</option>'

    })
  }
  $('#vara').html(option).show();
}


function formatarData(LocalDate, char) {
  if (LocalDate !== null) {
    if (LocalDate.indexOf("-") == 4 && LocalDate.length == 10) {
      LocalDate = LocalDate.substring(8, 10) + char + LocalDate.substring(5, 7) + char + LocalDate.substring(0, 4);
    }
    if (LocalDate.indexOf("-") == 2 && LocalDate.length == 10) {
      LocalDate = LocalDate.substring(6, 10) + char + LocalDate.substring(3, 5) + char + LocalDate.substring(0, 2);
    }
  }

  return LocalDate;
}

function exibirBtnGerar() {
  var btnGerar = document.querySelector('.btnGerar');
  var idMutirao = document.getElementById('mutirao');
  if (idMutirao) {
    idMutirao = idMutirao.options[idMutirao.selectedIndex].value;

    axios.get(baseURL + 'mutirao/').then(response => {
      var mutirao = response.data;

      mutirao = mutirao.filter(item => item.id == idMutirao);
      mutirao = mutirao[0];
      if (mutirao) {
        if (mutirao.status == "COM_ESCALA")
          btnGerar.style.display = 'none';
        else {
          btnGerar.style.display = 'inline';
        }
      }

    }).catch(error => console.error(error));
  }
}


//////////BOTÕES////////////



$('#gerar').on('click', function () {
  var tabela = $('#dataTable').DataTable();
  tabela.clear().draw();
  var idMutirao = document.getElementById('mutirao');
  idMutirao = idMutirao.options[idMutirao.selectedIndex].value;
  var grupo = document.getElementById('grupo');
  grupo = grupo.options[grupo.selectedIndex].value;
  axios.post(baseURL + 'mutirao/' + idMutirao + '/' + grupo).then(response => {
    let mutiraoSelected = document.getElementById("mutirao");
    mutiraoSelected.remove(mutiraoSelected.selectedIndex);
    if (document.getElementById("mutirao").options.length === 0) {
      let varaSelected = document.getElementById("vara");
      varaSelected.remove(varaSelected.selectedIndex);

    }

    if ((document.getElementById("vara").options.length === 0)) {
      document.querySelector('.btnGerar').style.display = "none";
      tabela.rows().remove().draw();
    } else {

      axios.get(baseURL + "mutirao/" + idMutirao + '/pautas').then(response => {
        pautas = response.data;

        pautas.forEach(listar);
      }).catch(error => console.log(error.message));
    }
  }).catch(error => console.error(error));

});

$('#vara').on('click', function () {
  var tabela = $('#dataTable').DataTable();
  tabela.clear().draw();
  var vara = document.getElementById('vara');
  if (vara.options.length !== 0) {
    getMutirao();

    axios.get(baseURL + "mutirao/" + document.getElementById("mutirao").value + '/pautas').then(response => {
      pautas = response.data;
      pautas.forEach(listar)
    }).catch(error => console.log(error));

  }
});

$('#mutirao').on('click', function () {
  var tabela = $('#dataTable').DataTable();
  tabela.clear().draw();
  var mutirao = document.getElementById('mutirao');
  if (mutirao.options.length !== 0) {
    axios.get(baseURL + "mutirao/" + document.getElementById("mutirao").value + '/pautas').then(response => {
      pautas = response.data;
      pautas.forEach(listar)
    }).catch(error => console.log(error));

  }


});


$('#editar').click(function () {
  var table = $('#dataTable').DataTable();
  pauta = table.row('.selected').data();
  if (pauta)
    var processo = pauta[4];

  sessionStorage.setItem('processo', processo);
});