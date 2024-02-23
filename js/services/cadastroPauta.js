import baseURL from '../../ambiente/baseURL.js'

let mensagem = '';
let listaDePautas = [];
let pautaJson = {
    "data": "",
    "hora": "",
    "turno": "",
    "sala": "",
    "processo": "",
    "nomeParte": "",
    "cpf": "",
    "nomeAdvogado": "",
    "objeto": "",
    "vara": "",
    "tipo": "",
}
var result_cont_datas;
var result_cont_horas;
var result_cont_turnos; 
var result_cont_salas;
var result_cont_processos;
var result_cont_nome_parte;


function removerEspacos(string) {
    return string.replace(/^\s+|\s+$/g, "");
}

function formatar(key, textarea) {
    textarea = textarea.split(/\r|\n/);
    for (var i in textarea) {
        if (textarea[i] == '') {
            return;
        }
        textarea[i] = removerEspacos(textarea[i]);
        if (key == 'data') {
            if (textarea[i].length == 10) {
                if (textarea[i].indexOf("/") == 2 || textarea[i].indexOf("-") == 2) {
                    if (textarea[i].substring(0, 2) > 31 || textarea[i].substring(3, 5) > 12) {
                        textarea[i] = "null";
                    } else {
                        textarea[i] = textarea[i].substring(6, 10) + "-" + textarea[i].substring(3, 5) + "-" + textarea[i].substring(0, 2);
                    }
                } else {
                    var linha = i;
                }
            } else {
                var linha = i + 1;
                mensagem = `Data dd/mm/aaaa com formato inválido: ${textarea[i]}`;
            }
        }
        else if (key == "hora") {
            let pattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!(pattern.test(textarea[i]))) {
                return "hora inválida";
            }
        }
        else if (key === "turno") {
            if (textarea[i] !== "MANHÃ" && textarea[i] !== "TARDE") {
                return;
            }
        } /* else if (key == "sala") {
            let pattern = /^[0-9]$/;
            if (!pattern.test(textarea[i])) {
                return;
            }
        } */
    }
    return textarea;
}
//////////// CONTADOR DE LINHAS DAS TEXT AREAS /////////////
$('#data-pauta').on('input', function () {
    let textArea = document.querySelector("#data-pauta").value;
    let array = textArea.split("\n");
    result_cont_datas = `${array.length}`;
    document.getElementById("cont_linhas_data").innerHTML = result_cont_datas;
  
});

$('#hora-pauta').on('input', function () {
    let textArea = document.querySelector("#hora-pauta").value;
    let array = textArea.split("\n");
    result_cont_horas = `${array.length}`;
    document.getElementById("cont_linhas_hora").innerHTML = result_cont_horas;

});

$('#turno-pauta').on('input', function () {
    let textArea = document.querySelector("#turno-pauta").value;
    let array = textArea.split("\n");
    result_cont_turnos = `${array.length}`;
    document.getElementById("cont_linhas_turno").innerHTML = result_cont_turnos;
    
});

$('#sala-pauta').on('input', function get_linhas_sala_pauta() {
    let textArea = document.querySelector("#sala-pauta").value;
    let array = textArea.split("\n");
    console.log(array)
    result_cont_salas = `${array.length}`;
    console.log(result_cont_salas) 
    document.getElementById("cont_linhas_sala").innerHTML = result_cont_salas;
    
});

$('#processo').on('input', function get_linhas_processo() {
    let textArea = document.querySelector("#processo").value;
    let array = textArea.split("\n");
    result_cont_processos = `${array.length}`;
    document.getElementById("cont_linhas_processo").innerHTML = result_cont_processos;
 
});

$('#nome-parte').on('input', function get_linhas_Nome_Parte () {
    let textArea = document.querySelector("#nome-parte").value;
    let array = textArea.split("\n");
    result_cont_nome_parte = `${array.length}`;
    document.getElementById("cont_linhas_nome_parte").innerHTML = result_cont_nome_parte;
    
});

//////////// BOTÕES /////////////

$('#cadastrar-pauta').on('click', function () {
    //captando dados das text areas e formatando 
    listaDePautas = [];
    var data = formatar("data", document.querySelector('#data-pauta').value);
    var hora = formatar("hora", document.querySelector('#hora-pauta').value);
    var turno = formatar("turno", document.querySelector('#turno-pauta').value.toUpperCase());
    var sala = formatar("sala", document.querySelector('#sala-pauta').value);
    console.log(sala)
    var processo = formatar("processo", document.querySelector('#processo').value);
    var nomeParte = formatar("nomeParte", document.querySelector('#nome-parte').value);
    var cpf = formatar("cpf", document.querySelector('#cpf-pauta').value);
    var nomeAdvogado = formatar("nomeAdvogado", document.querySelector('#nome-advogado').value);
    var objeto = formatar("objeto", document.querySelector('#objeto').value);
    var tipo = document.getElementById('tipo');
    tipo = tipo.options[tipo.selectedIndex].value.toUpperCase();
    var vara = document.getElementById('vara');
    vara = vara.options[vara.selectedIndex].value;
  
    let processosRepetidos = [];
    let aux = processo.filter(function(elemento,i){
        if(processo.indexOf(elemento) !== i){
            processosRepetidos.push(elemento);
        }
        return processo.indexOf(elemento) ==i;
    });

    if(processosRepetidos != ""){
        alert("o formulário contém numeros de processo repetidos verifique os seguintes números:\n"+processosRepetidos);
        return;
    }

    if(!(result_cont_datas == result_cont_horas && result_cont_turnos == result_cont_salas && result_cont_processos == result_cont_nome_parte) ){
        alert("O número de linhas é diferente ! \n verifique os campos");
    }

    if (vara === "") {
        alert("Vara não selecionada. Verifique.");
        return;
    }

    if (hora === "hora inválida") {
        alert("Campo hora está em formato incorreto. Por favor, verifique se todos os valores estão no formato HH:MM.");
        return;
    }

    if (turno === undefined) {
        alert("Algum valor no campo 'Turno' está incorreto. Apenas os valores 'MANHÃ' e 'TARDE' são permitidos.");
    }

    if (sala === undefined) {
        alert("O campo sala aceita apenas valores numéricos de um único dígito. Por favor, verifique");
        return;
    }

    if (typeof data === undefined || typeof hora === undefined || typeof turno === undefined || typeof sala === undefined || typeof processo === undefined || typeof nomeParte === undefined) {
        alert("Campo brigatório vazio. Por favor preencha todos.");
        return;
    }

    var i = 0;
    do {
        if (processo[i].trim() !== "") {
            pautaJson.data = data[i];
            pautaJson.hora = hora[i];
            pautaJson.turno = turno[i];
            pautaJson.sala = sala[i];
            pautaJson.processo = processo[i];
            pautaJson.nomeParte = nomeParte[i];
            if (cpf) {
                pautaJson.cpf = cpf[i];
            } else {
                pautaJson.cpf = "";
            }
            if (nomeAdvogado) {
                pautaJson.nomeAdvogado = nomeAdvogado[i];
            } else {
                pautaJson.nomeAdvogado = "";
            }
            if (objeto) {
                pautaJson.objeto = objeto[i];
            } else {
                pautaJson.objeto = "";
            }
            pautaJson.vara = vara;
            pautaJson.tipo = tipo;
            for (var key in pautaJson) {
                if (typeof pautaJson[key] == 'undefined')
                    pautaJson[key] = "";
            }
            var formattedJSON = JSON.stringify(pautaJson);
            listaDePautas.push(JSON.parse(formattedJSON));
        }

        i++;
    } while (i < processo.length);

    axios.post(baseURL + "pauta", listaDePautas).then(response => {
        if (response.status == 200) {
            alert('Pautas foram cadastradas.');
        }
        limparCampos();
    }).catch((error) => {
        alert('Erro ao cadastrar. ' + mensagem + '\nMensagem: ' + error.message || error);
    });
});



function limparCampos() {
    //textareas 
    document.getElementById("data-pauta").value = "";
    document.getElementById("hora-pauta").value = "";
    document.getElementById("turno-pauta").value = "";
    document.getElementById("sala-pauta").value = "";
    document.getElementById("processo").value = "";
    document.getElementById("nome-parte").value = "";
    document.getElementById("cpf-pauta").value = "";
    document.getElementById("nome-advogado").value = "";
    document.getElementById("objeto").value = "";
    document.getElementById("vara").value = "1ª Vara Federal";
    document.getElementById("tipo").value = "Conciliação";

    //contador de linhas
    document.getElementById("cont_linhas_data").innerHTML = "";
    document.getElementById("cont_linhas_hora").innerHTML="";
    document.getElementById("cont_linhas_turno").innerHTML="";
    document.getElementById("cont_linhas_sala").innerHTML="";
    document.getElementById("cont_linhas_processo").innerHTML="";
    document.getElementById("cont_linhas_nome_parte").innerHTML="";

}