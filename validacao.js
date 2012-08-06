/*
* VALIDAÇÃO GERAL DE FORMULÁRIOS POR RCDMK - Agosto de 2010
* https://www,github.com/rcdmk/validaform
*
* TODO:
*	- Poder utilizar qualquer combinação de validações em um mesmo campo;
*	- Validar se o campo tem somente números, ou somente letras;
*	- Validar nível de senha;
*	- Validar url;

* USO das validações
*  Insira um atributo "rel" no campo para validar:
* 	- Preenchimento obigatório: o primeiro caractere do atributo tem que ser um # e o restante, separado por um espaço, será utilizado na mensagem de erro. Ex.: rel="# o nome do campo"
* 	- Validação de e-mail: o segundo caractere do atributo tem que ser @. Ex.: rel="#@ o e-mail de contato" (obrigatório) ou rel=" @ o e-mail de contato" (não obrigatório)
* 	- Validação de CPF: o segundo caractere tem que ser F (de pessoa Física);
* 	- Validação de CNPJ: o segundo caractere tem que ser J (de pessoa Jurídica);
* 	- Validação de tamanho ou comprimento do valor: o segundo caractere tem que ser T e o terceiro o tamanho a ser validado. Ex.: rel="#T9 o telefone"
* 	- Validação por comparação igual (senha e confirmação de senha, etc): o segundo caractere tem que ser = e o terceiro o ID do campo a ser comparado. Ex.: rel="#=confirmaSenha a senha"
*
* LICENÇA
* 	Creative Commons License
* 	CC - BY SA
*	http://www.creativecommons.org/licenses/by-sa/3.0/
*
*/

/* ### VALIDAÇÃO ### */
/*
* Função principal
* @param formulario: o formulário para validar
*/
function validaform(formulario){
	var pass = true;
	var passCompara = true;
	var msg = 'Atenção:\n\n';
	var msgCompara = msg;
	var campofoco = false;
	var botoes = [];

	// Somente valida se o browser suportar navegação pelos elementos do form
	if (formulario.elements) {
		var campos = formulario.elements;
		var totalCampos = campos.length;
		var campoAtual = "";
		
		for (var i = 0; i < totalCampos; i++) {
			var elemento = campos[i];
			var tipoCampo = elemento.type.toLowerCase();
			
			// valida somente se o elemento não for um botão, um campo hidden e se tiver o atributo rel
			if (elemento.attributes && elemento.attributes.rel && tipoCampo != 'image' && tipoCampo != 'submit' && tipoCampo != 'button' && tipoCampo != 'hidden' && tipoCampo != 'reset') {
				// restaura a aparência original do campo
				marcaDesmarcaCampo(elemento, false);
				
				var nomeCampo = (elemento.attributes.name) ? elemento.attributes.name.value : elemento.name;
				
				if (campoAtual != nomeCampo) {
					campoAtual = nomeCampo;
					
					if (elemento.attributes.rel.value.indexOf("#") == 0) {
						// validação de vazio (obrigatório)
						
						if (((tipoCampo == "text" || tipoCampo == "textarea" || tipoCampo == "file" || tipoCampo == "password" || tipoCampo.indexOf("select") == 0) && elemento.value == "") || (tipoCampo.indexOf("select") == 0 && (elemento.selectedIndex) ? elemento.selectedIndex == -1 : false)) {
							msg += '- Informe ' + ((elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + '.\n';
							pass = false;
							marcaDesmarcaCampo(elemento, true);
							if (!campofoco) campofoco = elemento;
							
						} else if (tipoCampo == "radio" || tipoCampo == "checkbox") {
							var opcoes = document.getElementsByName(campoAtual);
							var passOpcoes = false;
							
							for (var j = 0; j < opcoes.length; j++) {
								if (opcoes[j].checked) {
									passOpcoes = true;
									break;
								}
							}
							
							if (!passOpcoes) {
								msg += '- Informe ' + ((elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + '.\n';
								pass = false;
								marcaDesmarcaCampo(elemento, true);
								if (!campofoco) campofoco = elemento;
							}
						}
					}
					
					// Para otimizar o desempenho, só valida os formatos se passar por todos os obrigatórios
					if (pass && elemento.value != "" && (tipoCampo == "text" || tipoCampo == "textarea" || tipoCampo == "password")) {
						// Tamanho =
						if(elemento.attributes.rel.value.indexOf("T") == 1 || elemento.attributes.rel.value.indexOf("T") == 2) {
							var segundo = elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf("T") + 1, elemento.attributes.rel.value.indexOf(' ', 1));
							
							if (elemento.value.length != Number(segundo)) {
								msgCompara += '- ' + ((elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' precisa ter ' + segundo + ' caracteres.\n'
								if (!campofoco) campofoco = elemento;
								marcaDesmarcaCampo(elemento, true);
								passCompara = false;
							}
						}
						
						// Comparação =
						if(elemento.attributes.rel.value.indexOf("=") == 1) {
							var segundo = document.getElementById(elemento.attributes.rel.value.substring(2, elemento.attributes.rel.value.indexOf(' ', 1)));
							
							if (elemento.value != segundo.value) {
								msgCompara += '- ' + ((elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' e ' + ((elemento.attributes.rel && elemento.attributes.rel.value != "#") ? segundo.attributes.rel.value.substring(segundo.attributes.rel.value.indexOf(' ', 1)) : segundo.name) + ' não batem.\n'
								if (!campofoco) campofoco = elemento;
								marcaDesmarcaCampo(elemento, true);
								passCompara = false;
							}
						}
						
						// Comparação >
						else if(elemento.attributes.rel.value.indexOf(">") == 1) {
							var segundo = document.getElementById(elemento.attributes.rel.value.substring(2, elemento.attributes.rel.value.indexOf(' ', 1)));
	
							if (isNaN(cnvvl(elemento.value)) || isNaN(cnvvl(segundo.value)) || cnvvl(elemento.value) < cnvvl(segundo.value)) {
								msgCompara += '- ' + ((elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' não pode ser menor que ' + ((elemento.attributes.rel && elemento.attributes.rel.value != "#") ? segundo.attributes.rel.value.substring(segundo.attributes.rel.value.indexOf(' ', 1)) : segundo.name) + '.\n'
								if (!campofoco) campofoco = elemento;
								marcaDesmarcaCampo(elemento, true);
								passCompara = false;
							}
						}
						
						// Comparação <
						else if(elemento.attributes.rel.value.indexOf("<") == 1) {
							var segundo = document.getElementById(elemento.attributes.rel.value.substring(2, elemento.attributes.rel.value.indexOf(' ', 1)));
	
							if (isNaN(cnvvl(elemento.value)) || isNaN(cnvvl(segundo.value)) || cnvvl(elemento.value) > cnvvl(segundo.value)) {
								msgCompara += '- ' + ((elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' não pode ser maior que ' + ((elemento.attributes.rel && elemento.attributes.rel.value != "#") ? segundo.attributes.rel.value.substring(segundo.attributes.rel.value.indexOf(' ', 1)) : segundo.name) + '.\n'
								if (!campofoco) campofoco = elemento;
								marcaDesmarcaCampo(elemento, true);
								passCompara = false;
							}
						}
						
						// Data
						else if (elemento.attributes.rel.value.indexOf("D") == 1) {
							if(!validaData(elemento.value)) {
								msgCompara += '- ' + ((elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' informada é inválida.\n';
								if (!campofoco) campofoco = elemento;
								marcaDesmarcaCampo(elemento, true);
								passCompara = false;
							}
						}
						
						// URL
						else if(elemento.attributes.rel.value.indexOf("U") == 1) {
							if (!elemento.value.match("^(http|https|ftp)\:// ([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$")){
								msgCompara += '- ' + ((elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' informada é inválida.\n';
								if (!campofoco) campofoco = elemento;
								marcaDesmarcaCampo(elemento, true);
								passCompara = false;
							}
						}
						
						// E-mail
						else if(elemento.attributes.rel.value.indexOf("@") == 1) {
							if (!elemento.value.match("^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9]))$")){
								msgCompara += '- ' + ((elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' informado é inválido.\n';
								if (!campofoco) campofoco = elemento;
								marcaDesmarcaCampo(elemento, true);
								passCompara = false;
							}
						}
						
						// CPF ou CPNJ
						else if(elemento.attributes.rel.value.indexOf("F") == 1 || elemento.attributes.rel.value.indexOf("J") == 1) {
							if (!validaCPFouCNPJ(elemento.value)) {
								msgCompara += '- ' + ((elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' informado é inválido.\n';
								if (!campofoco) campofoco = elemento;
								marcaDesmarcaCampo(elemento, true);
								passCompara = false;
							}
						}
						
						// Range(Ex.: "0-120" ou "01/01/2010-31/12/2010")
						else if(elemento.attributes.rel.value.indexOf("R") == 1) {
							var rel = elemento.attributes.rel.value;
							var inicio = rel.substring(3, rel.indexOf("-"));
							var final = rel.substring(rel.indexOf("-") + 1, rel.indexOf(" ", 1));
							var valor = elemento.value;
							
							// Números
							if (elemento.attributes.rel.value.indexOf("N") == 2) {
								inicio = cnvvl(inicio);
								final = cnvvl(final);
								valor = cnvvl(valor);
								
								if (valor < inicio || valor > final) {
									msgCompara += '- ' + ((elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' está fora do intervalo válido (' + inicio + ' à ' + final + ').\n';
									if (!campofoco) campofoco = elemento;
									marcaDesmarcaCampo(elemento, true);
									passCompara = false;
								}
							}
							
							// Datas
							if (elemento.attributes.rel.value.indexOf("D") == 2) {
								inicio = new Date(cnvdtUS(inicio));
								final = new Date(cnvdtUS(final));
								valor = new Date(cnvdtUS(valor));
								
								if (isNaN(inicio) || isNaN(final) || isNaN(valor) || valor < inicio || valor > final) {
									msgCompara += '- ' + ((elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' está fora do intervalo válido (' + inicio + ' à ' + final + ').\n';
									if (!campofoco) campofoco = elemento;
									marcaDesmarcaCampo(elemento, true);
									passCompara = false;
								}
							}
						}
					}
				}
			} else if(tipoCampo == 'image' || tipoCampo == 'submit' || tipoCampo == 'button' || tipoCampo == 'reset') {
				botoes.push(elemento);
			}
		}
	}
	
	if (!pass){
		alert(msg);
		if (campofoco.type.toLowerCase().indexOf("select") == 0 || campofoco.type.toLowerCase() == "checkbox" || campofoco.type.toLowerCase() == "radio") {
			campofoco.focus();
			
		} else  {
			campofoco.select();
		}
	} else {
		pass = passCompara;
		if (!passCompara) {
			if (segundo && typeof segundo == "object") marcaDesmarcaCampo(segundo, true);
			segundo = undefined;
			
			alert(msgCompara);
			
			if (campofoco.type.toLowerCase().indexOf("select") == 0 || campofoco.type.toLowerCase() == "checkbox" || campofoco.type.toLowerCase() == "radio") {
				campofoco.focus();
			
			} else  {
				campofoco.select();
			}
		} else {
			for (var i = 0; i < botoes.length; i++) {
				botoes[i].disabled = true;
			}
		}
	}
	
	
	return pass;
}

/*
* Função que valida um CPF ou CNPJ
* Obs.: utilizada na validaform()
* @param string/number valor: um valor (número ou string, formatada ou não com os pontos, barra e traço) para validar
* @return boolean: true se for válido, caso contrário false
* @example: if (!validaCPFouCNPJ("123.456.789-10")) alert("CPF ou CNPJ inválido"); output: "CPF ou CNPJ inválido";
*/
function validaCPFouCNPJ(valor) {
	var numero = String(valor).replace(/\D/ig, ""); // converte para texto e remove tudo o que não for número
	
	// se o tamanho não bater com o de CPF ou CNPJ então é inválido
	if (numero.length != 11 && numero.length != 14) {
		return false;
	
	// se bater com CPF, valida o CPF
	} else if (numero.length == 11) {
		return validaCPF(numero);
		
	// se bater com CNPJ, valida o CNPJ
	} else {
		return validaCNPJ(numero);
	}
}


/*
* Função que valida um CNPJ
* Obs.: utilizada na validaCPFouCNPJ()
* @param string/number varCNPJ: um valor (número ou string, sem os pontos, barra e traço) para validar
* @return boolean: true se for válido, caso contrário false
* @example: if (!validaCNPJ("12345678901234")) alert("CNPJ inválido"); output: "CNPJ inválido";
*/
function validaCNPJ(varCNPJ) {
	var RecebeCNPJ = String(varCNPJ);
	var Numero = new Array(15), soma, resultado1, resultado2;

	// se não tiver o tamanho de um CPNJ, é inválido
	if (RecebeCNPJ.length != 14) {
		return false;
		
	// se for uma sequência de números repetidos, é inválido
	} else if (RecebeCNPJ == "00000000000000" || RecebeCNPJ === "11111111111111" || RecebeCNPJ === "22222222222222" || RecebeCNPJ == "33333333333333" || RecebeCNPJ == "44444444444444" || RecebeCNPJ == "55555555555555" || RecebeCNPJ == "66666666666666" || RecebeCNPJ == "77777777777777" || RecebeCNPJ == "88888888888888" || RecebeCNPJ == "99999999999999") {
		return false;
	
	// se não, executa a validação completa (mod 11)
	} else {
		Numero = (" "+RecebeCNPJ).split(""); // converte em um array de 15 posições (a primeira é apenas para facilitar o raciocínio)
	
		soma = (Numero[1] * 5) + (Numero[2] * 4) + (Numero[3] * 3) + (Numero[4] * 2) + (Numero[5] * 9) + (Numero[6] * 8) + (Numero[7] * 7) + (Numero[8] * 6) + (Numero[9] * 5) + (Numero[10] * 4) + (Numero[11] * 3) + (Numero[12] * 2);
		
		soma = soma % 11;
			
		if (soma < 2) {
			resultado1 = 0;
		} else {
			resultado1 = 11 - soma;
		}
	
		if (resultado1 == Numero[13]) {
			soma = (Numero[1] * 6) + (Numero[2] * 5) + (Numero[3] * 4) + (Numero[4] * 3) + (Numero[5] * 2) + (Numero[6] * 9) + (Numero[7] * 8) + (Numero[8] * 7) + (Numero[9] * 6) + (Numero[10] * 5) + (Numero[11] * 4) + (Numero[12] * 3) + (Numero[13] * 2);
		
			soma = soma % 11;
			
			if (soma < 2) {
				resultado2 = 0;
			} else {
				resultado2 = 11 - soma;
			}
		
			if (resultado2 == Numero[14]) {
				// CNPJ Válido;
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}

/*
* Função que valida um CPF
* Obs.: utilizada na validaCPFouCNPJ()
* @param string/number varCPF: um valor (número ou string, sem os pontos e traço) para validar
* @return boolean: true se for válido, caso contrário false
* @example: if (!validaCPF("12345678910")) alert("CPF inválido"); output: "CPF inválido";
*/
function validaCPF(varCPF) {
	var RecebeCPF = String(varCPF);
	var Numero = new Array(12);
	var soma, resultado1, resultado2;
	
	// se não tiver o tamanho de um CPF então é inválido
	if (RecebeCPF.length != 11) {
		return false;
		
	// se for uma sequência de números repetidos então é inválido
	} else if (RecebeCPF == "00000000000" || RecebeCPF == "11111111111" || RecebeCPF == "22222222222" || RecebeCPF == "33333333333" || RecebeCPF == "44444444444" || RecebeCPF == "55555555555" || RecebeCPF == "66666666666" || RecebeCPF == "77777777777" || RecebeCPF == "88888888888" || RecebeCPF == "99999999999") {
		return false;
		
	// se não, executa a validação completa (mod 11)
	} else {
		Numero = (" "+RecebeCPF).split(""); // converte em um array de 12 posições (a primeira é apenas para facilitar o raciocínio)

		soma = (10 * Numero[1]) + (9 * Numero[2]) + (8 * Numero[3]) + (7 * Numero[4]) + (6 * Numero[5]) + (5 * Numero[6]) + (4 * Numero[7]) + (3 * Numero[8]) + (2 * Numero[9]);
		
		soma = soma % 11;
			
		if (soma < 2) {
			resultado1 = 0;
		} else {
			resultado1 = 11 - soma;
		}

		if (resultado1 == Numero[10]) {
			soma = (Numero[1] * 11) + (Numero[2] * 10) + (Numero[3] * 9) + (Numero[4] * 8) + (Numero[5] * 7) + (Numero[6] * 6) + (Numero[7] * 5) + (Numero[8] * 4) + (Numero[9] * 3) + (Numero[10] * 2);
			
			soma = soma % 11;
			
			if (soma < 2) {
				resultado2 = 0;
			} else {
				resultado2 = 11 - soma;
			}
		
			if (resultado2 == Numero[11]) {
				// CPF Válido;
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}

/*
* Função que valida uma data
* Obs.: utilizada na validaform()
* @param string data: uma string com uma data no formato latino para validar
* @return boolean: true se for válida, caso contrário false
* @example: if (!validaData("31/02/2015")) alert("Data inválida"); output: "Data inválida";
*/
function validaData(data) {
	var padraoData = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
	
	var matchArray = data.match(padraoData);
	
	if (matchArray == null) return false; // se não estiver no formato de data, retorna inválida
	
	dia = matchArray[1];
	mes = matchArray[2];
	ano = matchArray[3];
	
	if (mes < 1 || mes > 12) return false; // se o mês for inválido, retorna inválida
	
	if (dia < 1 || dia > 31) return false; // se o dia for inválido, retorna inválida
	
	if ((mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia == 31) return false; // se não for um mês de 31 dias e o dia for 31, retorna inválida
	
	if (mes == 2) { // se for fevereiro
		var bissexto = (ano % 4 == 0 && (ano % 100 != 0 || ano % 400 == 0)); // o ano é bissexto?
		
		if (dia > 29 || (dia == 29 && !bissexto)) return false;  // se o dia for maior que 29 ou se o dia for 29 e o ano não for bissexto, retorna inválida
	}
	
	return true; // se chegou até aqui é uma data válida
}
/* ### FIM VALIDAÇÃO ### */



/* ### FORMATAÇÃO ### */
/*
* Função que formata a entrada de texto de um campo
* @param object campo: a referência ao campo para aplicar a formatação
* @param string mascara: uma string com a máscara de formatação
* @param object event: a referência ao evento que a função é chamada
* @param optional string chave: uma string com o caractere chave para ser usado na máscara
* @return: nothing
* @example: <input type="text" ... onkeypress="formatar(this, '##/##/####', event, '#');">
*/
function formatar(campo, mascara, event, chave) {
	var e = (!window.event) ? event : window.event;

	if (e && (e.type == "keypress" || e.type == "keyup" || e.type == "keydown")) {
		var code = (!e.which) ? ((!e.charCode) ? e.keyCode : e.charCode) : e.which;
		
		if (code == 8 || code == 9 || code == 13 || code == 46 || code == 116 || (e.ctrlKey && (code == 67 || code == 86 || code == 88 || code == 90))) return; // backspace, tab, enter, delete, F5 e CTRL + C ou V
	}
	
	var tamanho = campo.value.length;
	
	var atual = mascara.substr(tamanho, 1);
	chave = (!chave) ? "#" : chave;
	
	if (atual != chave) campo.value += atual;
}

/*
* Função que formata a entrada de texto de um campo para maiúsculas
* @param object campo: a referência ao campo para aplicar a formatação
* @return: nothing
* @example: <input type="text" ... onkeyup="maiusculas(this);">
*/
function maiusculas(campo) {
	campo.value = campo.value.toUpperCase();
}

/*
* Função que formata a entrada de texto de um campo para minúsculas
* @param object campo: a referência ao campo para aplicar a formatação
* @return: nothing
* @example: <input type="text" ... onkeyup="maiusculas(this);">
*/
function minusculas(campo) {
	campo.value = campo.value.toLowerCase();
}

/*
* Função que formata o valor de um campo para um número de duas casas decimais com vírgula
* @param object campo: a referência ao campo para aplicar a formatação
* @param optional number casas default 2: um número inteiro representando a quantidade de casas decimais
* @return: nothing
* @example: <input type="text" ... onkeyuf="formataValor(this);">
*/
function formataValor(campo, casas) {
	var valor = campo.value;
	
	if (casas == undefined || isNaN(casas)) casas = 2;
	
	if (valor != "") {
		campo.value = String(
						Number(
							valor.replace(/\./g, "") // remove todos os pontos do texto
							.reverse() // reverte o texto
							.replace(/,/, ".") // troca a primeira vírgula por um ponto
							.replace(/,/g, "") // remove as vírgulas restantes
							.reverse() // reverte o texto ao original
						).toFixed(casas) // converte em número com duas casas decimais
					).replace(/\./g, ","); // converte em texto, trocando o ponto por vírgula
	}
}

/*
* Função que converte uma string de data no formato americano
* Obs.: utilizada na validaform()
* @param string data: uma string com uma data para formatar
* @return string: uma string com a data no formato mm/dd/aaaa
* @example: var dataUS = cnvdtUS("21/05/2011"); output: dataUS = "05/21/2011";
*/
function cnvdtUS(data) {
	data = String(data);
	var dia = data.substr(0, data.indexOf("/"));
	var mes = data.substr(data.indexOf("/") + 1, data.lastIndexOf("/") - data.indexOf("/") - 1);
	var ano = data.substr(data.lastIndexOf("/") + 1, data.length - data.lastIndexOf("/"));
	
	return (mes + "/" + dia + "/" + ano);
}

/*
* Função que converte uma string em número
* Obs.: utilizada na validaform()
* @param string valor: uma string com um valor para converter
* @return number: um número com o valor da string convertida
* @example: var numero = cnvvl("2.000,00"); output: numero = 2000.00;
*/
function cnvvl(valor) {
	return Number(
				  String(valor) // converte o valor em texto (se ainda não for)
				  .replace(/\./g, "") // remove os pontos
				  .replace(/,/, ".") // troca a vírgula por ponto
				  ); // converto em número no final
}

/*
* Função que converte um número em string formatada no padrão latino
* Obs.: utilizada na validaform()
* @param number numero: um número para converter
* @return string: uma string com o valor do número convertido
* @example: var numeroStr = numStr(2000.00); output: numeroStr = "2000,00";
*/
function numStr(numero) {
	return String(numero) // converto o número em texto
			.reverse() // reverte o texto
			.replace(/,/g, "") // remove as vírgulas
			.replace(/\./, ",") // troca o primeiro ponto por vírgula
			.replace(/\./g, "") // remove os pontos restantes
			.reverse(); // reverte o texto ao seu original
}
/* ### FIM FORMATAÇÃO ### */



/* ### RESTRIÇÃO DE ENTRADA ### */
/*
* Função que restringe entrada de texto a somente números
* @param object campo: a referência ao campo para aplicar a validação
* @param object event: a referência ao evento que a função é chamada
* @return boolean: true se a tecla pressionada for um número, caso contrário false
* @example: <input type="text" ... onkeypress="return SomenteNumeros(this, event);">
*/
function SomenteNumeros(campo, event) {
	return limitarEntrada(campo, event, /[0-9]/);
}

/*
* Função que restringe entrada de texto a somente números e vírgulas
* @param object campo: a referência ao campo para aplicar a validação
* @param object event: a referência ao evento que a função é chamada
* @return boolean: true se a tecla pressionada for um número ou vírgula, caso contrário false
* @example: <input type="text" ... onkeypress="return SomenteNumerosDecimais(this, event);">
*/
function SomenteNumerosDecimais(campo, event) {
	return limitarEntrada(campo, event, /[0-9,]/);
}

/*
* Função que restringe entrada de texto a somente letras de a-z ou A-Z
* @param object campo: a referência ao campo para aplicar a validação
* @param object event: a referência ao evento que a função é chamada
* @return boolean: true se a tecla pressionada for uma letra, caso contrário false
* @example: <input type="text" ... onkeypress="return SomenteLetras(this, event);">
*/
function SomenteLetras(campo, event) {
	return limitarEntrada(campo, event, /[a-zA-Z]/);
}

/*
* Função que restringe entrada de texto sem números
* @param object campo: a referência ao campo para aplicar a validação
* @param object event: a referência ao evento que a função é chamada
* @return boolean: true se a tecla pressionada não for um número, caso contrário false
* @example: <input type="text" ... onkeypress="return SemNumeros(this, event);">
*/
function SemNumeros(campo, event) {
	return limitarEntrada(campo, event, /[^0-9]/);
}

/*
* Função mestre que restringe a entrada de texto em um campo
* Obs.: Usada nas demais funções restritivas de entrada
* @param object campo: a referência ao campo para aplicar a validação
* @return boolean: true se o a tecla pressionada passar pela expressão de validação, caso contrário false
* @example: <input type="text" ... onkeypress="return limitarEntrada(this, event, /[a-z]/);">
*/
function limitarEntrada(campo, event, expressao) {
	var e = (!window.event) ? event : window.event;
	var valido = true;
	
	if (e.type == "keypress" || e.type == "keyup" || e.type == "keydown") {
		var code = (!e.which) ? ((!e.charCode) ? e.keyCode : e.charCode) : e.which;
		
		if (code == 8 || code == 9 || code == 13 || code == 46 || code == 116 || (e.ctrlKey && (code == 67 || code == 86 || code == 88 || code == 90))) return true; // backspace, tab, enter, delete, F5 e CTRL + C ou V
		
		valido = String.fromCharCode(code).match(expressao);
	}
	
	if (e.cancelBubble) e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	if (e.returnValue) e.returnValue = (valido != null) ? valido : false;
	return valido != null;
}

/*
* Função restringe a entrada de texto textareas a seu atributo maxlength
* Obs.: textareas não tem o atributo maxlength por padrão
* @param object campo: a referência ao campo para aplicar a validação
* @return boolean: true se o o tamanho do texto do campo for menor que o limite, caso contrário false
* @example: <input type="text" ... onkeyup="return limitaTextarea(this, event);" onkeypress="return limitaTextarea(this, event);">
*/
function limitaTextarea(campo, event) {
	var e = (!window.event) ? event : window.event;
	var limite = Number((campo.maxlength) ? campo.maxlength : (campo.attributes && campo.attributes.maxlength) ? campo.attributes.maxlength.value : campo.maxLength);
	var total = campo.value.length;
	
	if (e.type == "keyup") total += 1;
	
	if (total > limite) campo.value = campo.value.substr(0, limite);
	
	var code = (!e.which) ? ((!e.charCode) ? e.keyCode : e.charCode) : e.which;
		
	if (code == 8 || code == 9 || code == 13 || code == 46 || code == 116 || (e.ctrlKey && (code == 67 || code == 86 || code == 88 || code == 90))) {
		e.returnValue = true;
		return true;
	} else {
		e.returnValue = (total < limite);
		return (total < limite);
	}
}
/* ### FIM RESTRIÇÃO DE ENTRADA ### */



/* ### UTILIDADES ### */
/*
* Função que aplica ou retira o estilo de campo com erro na validação
* Obs.: utilizada na validaform()
* @param object qual: a referência ao campo para aplicar/remover o estilo
* @param boolean marcar: um valor boleano usado como flag para marcar ou desmarcar o campo
* @return: nothing
* @example: marcaDesmarcaCampo(document.getElementById("algumCampo"), true)
*/
function marcaDesmarcaCampo(qual, marcar) {
	qual.style.borderColor = (marcar) ? "#CC0000" : "";
	qual.style.backgroundColor = (marcar) ? "#FFCCCC" : "";
}

/*
* Função que formata um valor com caracteres no início para completar um tamanho específico
* @param string/number valor: uma string com um texto para formatar
* @param number tamanho: um inteiro com o tamanho para retornar
* @param string caractere: um inteiro com o tamanho para retornar
* @return string: uma string formatada com o caractere especificado
* @example: var numeroComZeros = completar(15, 6, "0"); output: numeroComZeros = "000015";
*/
function completar(valor, tamanho, caractere) {
	var completo = String(valor);
	
	// só completa se o tamanho for número válido e se o caracrete foi especificado
	if (!isNaN(Number(tamanho)) && caractere != "" && caractere != null) {
		var tamanhoAntigo = valor.length;
		
		for (var i = tamanhoAntigo; i < tamanho; i++) {
			completo = catactere + completo;
		}
	}
	
	return completo;
}


if (!String.prototype.reverse) {
	/*
	* Função para reverter uma string
	* Obs.: usada em formataValor() e numStr()
	* @return string: a string revertida
	* @example: var texto = "abcd123"; alert(texto.reverse()); output: "321dcba";
	*/
	String.prototype.reverse = function() {
		var tmp = "";
		var texto = this.split("");
		
		for (var i = texto.length - 1; i >= 0; i--)  tmp += texto[i];
		
		return tmp;
	}
}

if (!String.prototype.trim) {
	/*
	* Função para "aparar" uma string (remover espaços nas pontas)
	* @return string: a string "aparada"
	* @example: var texto = "    texto com espaço nas pontas    "; alert(texto.trim()); output: "texto com espaço nas pontas";
	*/
	String.prototype.trim = function() {
		return this.replace(/(^\s+)|(\s+$)/g, "");
	}
}

/*
* Habilitar o cache de imagens de fundo para o IE 6
*/
 try {
	document.execCommand("BackgroundImageCache",false,true);
} catch(e) { };
/* ### FIM UTILIDADES ### */
