import baseURL from '../../ambiente/baseURL.js'

let mutiroes = [];
window.onload = function () {
  listarVaras();
};

function listarVaras() {
  axios.get(baseURL + 'mutirao/').then(response => {
    var mutirao = response.data;
    getVara(mutirao);
    getMutirao();
  }).catch(error => console.error(error));
}

function getVara(mutirao) {
  mutiroes = [];
  var option;
  let varas = [];
  option = '<option value= "sem vara">' + "Escolha uma vara" + '</option>';

  $.each(mutirao, function (i, obj) {
    mutiroes.push(obj);
    if (varas.indexOf(obj.vara) === -1) {
      varas.push(obj.vara);
    }
  })
  if (varas) {
    varas.forEach(value => {
      option += '<option value="' + value + '">' + value + '</option>'

    })
  }
  $('#vara').html(option).show();
}

function getMutirao() {
  let option;

  var vara = document.getElementById('vara');

  if (vara.options.length !== 0) {

    vara = vara.options[vara.selectedIndex].value;
    mutiroes.forEach(obj => {
      if (obj.vara === vara) {
        option += '<option value="' + obj.id + '">' + formatarData(obj.dataInicial, "/") + ' a ' + formatarData(obj.dataFinal, "/") + '</option>';
      }
    })
    $("#mutirao").html(option).show();
    exibirBtnExcluir();
  }
}

function exibirBtnExcluir() {
  var btnGerar = document.getElementById('btnExcluir');
  var idMutirao = document.getElementById('mutirao');
  if (idMutirao.options.length != 0) {
    idMutirao = idMutirao.options[idMutirao.selectedIndex].value;

    axios.get(baseURL + 'mutirao/').then(response => {
      var mutirao = response.data;

      mutirao = mutirao.filter(item => item.id == idMutirao);
      mutirao = mutirao[0];
      if (mutirao) {
        btnGerar.style.display = 'inline';
      } else {
        btnGerar.style.display = "none";
      }

    }).catch(error => console.error(error));
  }
}

$('#vara').on('click', function () {
  var vara = document.getElementById('vara');
  var btnGerar = document.getElementById('btnExcluir');
  if (vara.options.length !== 0) {
    if (vara.options[vara.selectedIndex].value == "sem vara") {
      $("#mutirao").html("").show();
      btnGerar.style.display = "none";
    }
    getMutirao();
  }
});

$('#btnExcluir').on('click', function () {
  $("#excluirModal").modal("show");
});

$("#modalBtnExcluir").on("click", () => {
  var idMutirao = document.getElementById('mutirao');
  idMutirao = idMutirao.options[idMutirao.selectedIndex].value;
  axios.delete(baseURL + 'mutirao/' + idMutirao).then(response => {
    listarVaras();
    if ((document.getElementById("vara").options.length === 0)) {
      document.getElementById('btnExcluir').style.display = "none";
    }
    $("#excluirModal").modal("hide");
    $("#mutirao").html("").show();
    document.getElementById('btnExcluir').style.display = "none";
    alert("Mutirão excluído");
  }).catch(error => console.error(error));
});

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