/*
* VALIDAÇÃO GERAL DE FORMULÁRIOS POR RCDMK - Agosto de 2010
*
* Versão 2.5 - Março de 2011
*	- Corrigir um bug com a função de validação de data no Firefox;
*
* Versão 2.4 - Janeiro de 2011
*	- Adicionada uma função para limitar textareas, chamada limitaTextarea;
*	- Corrigido um bug com a função de formatação, onde a máscara não funcionava no campo;
*	- Corrigido um bug com as funções de formatação e somente números, que não aceitava copiar e colar usando CTRL+C, CTRL+V, etc;
*	- Corrigido um bug com as funções de validação, que causavam erros se o tamanho do campo estivesse diferente do especificado;
*	- Permitido usar a função de validação de tamanho junto com funções de um caractere:
*		- Ex.: Para validar um campo de data com 10 catacteres obrigatorios: rel="#DT10 a data de nascimento";
*	- Restrição para não digitar números: onkeypress="return SemNumeros(this, event);"
*
* Versão 2.3 - Dezembro de 2010
* 	- Finalizada a implementação da Range de Números
* 		- Ex.: Para validar um campo que aceite apenas números de 1 a 10: rel=" RN1-10 o campo";
*	- Acrescentada a função utilitária numStr para converter números em texto;
*
* Versão 2.2 - Novembro de 2010
*	- Se a validação passar, os botões do formulário são deativados para evitar duplo clique
* 	- Permitido usar as teclas ENTER, BACKSPACE, DELETE, TAB, F5 e CTRL+C ou V nos campos com restrição de entrada;
*	- Corrigido bug com navegadores "não IE" nos campos com máscara (não permitia apagar o caractere inserido pela máscara);
*	- Inclusa a função de completar cracteres:
*		- completar(texto, tamanho, caractere);
*		- var ano = completar(new Date().getYear(), 4, "0");
*	- Os 2 campos comparados agora são marcados em caso de diferença;
*	- Corrigido um bug com campos radio e checkbox que, quando passavam pela validação, anulavam as verificações de erro anteriores;
*
* Versão 2.1 - Agosto de 2010
* 	- Corrigido o problema com CPF's e CNPJ's válidos dados como inválidos;
* 	- Agora é permitido utilizar as validações de formato, etc., sem o campo ser obrigatório
*
* USO das validações
* Insira um atributo "rel" no campo para validar:
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
*	http://creativecommons.org/licenses/by-sa/3.0/
*	
*	PT-BR
*		Livre para:
*			- copiar, compartilhar, distribuir e transmitir o trabalho.
*			- adaptar o trabalho.
* 
*		Sobre as condições:
*	 		- Atribuição: Você precisa atribuir o rabalho da mesma maneira especificada pelo autor ou licenciador (mas não de uma maneira que sugira que estes endoçam você ou o seu uso do trabalho).
*			- Compartilhar igualmente: Se você alterar, transformar ou construir um trabalho sobre este, você precisa distribuir o trabalho resultante sob a mesma licença ou uma similar a esta.
*
*	EN
*		You are free:
*			- to copy, share, distribute and transmit the work.
*			- to adapt the work.
* 
*		Under the following conditions:
*			- Attribution: You must attribute the work in the manner specified by the author or licensor (but not in any way that suggests that they endorse you or your use of the work). 
*			- Share Alike: If you alter, transform, or build upon this work, you may distribute the resulting work only under the same or similar license to this one.
*
*/
function validaform(formulario){
	var pass = true;
	var passCompara = true;
	var msg = 'Atenção:\n\n';
	var msgCompara = msg;
	var campofoco = false;
	var botoes = [];

	if (formulario.elements) {
		var campos = formulario.elements;
		var campoAtual = "";

		for (var i = 0; i < campos.length; i++) {
			var elemento = campos[i];

			if (elemento.attributes && elemento.attributes.rel && elemento.type.toLowerCase() != 'image' && elemento.type.toLowerCase() != 'submit' && elemento.type.toLowerCase() != 'button' && elemento.type.toLowerCase() != 'hidden' && elemento.type.toLowerCase() != 'reset') {
				marcaDesmarcaCampo(elemento, false);
				
				var nomeCampo = (elemento.attributes && elemento.attributes.name) ? elemento.attributes.name.value : elemento.name;
				
				if (campoAtual != nomeCampo) {
					campoAtual = nomeCampo;
					
					if (elemento.attributes.rel.value.indexOf("#") == 0) {
						//validação de vazio (obrigatório)
						if (((elemento.type.toLowerCase() == "text" || elemento.type.toLowerCase() == "textarea" || elemento.type.toLowerCase() == "file" || elemento.type.toLowerCase() == "password" || elemento.type.toLowerCase().indexOf("select") == 0) && elemento.value == "") || (elemento.type.toLowerCase().indexOf("select") == 0 && (elemento.selectedIndex) ? elemento.selectedIndex == -1 : false)) {
							msg += '- Informe ' + ((elemento.attributes && elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + '.\n';
							pass = false;
							marcaDesmarcaCampo(elemento, true);
							if (!campofoco) campofoco = elemento;
							
						} else if (elemento.type.toLowerCase() == "radio" || elemento.type.toLowerCase() == "checkbox") {
							var opcoes = document.getElementsByName(campoAtual);
							var passOpcoes = false;
							
							for (var j = 0; j < opcoes.length; j++) {
								if (opcoes[j].checked) {
									passOpcoes = true;
									break;
								}
							}
							
							if (!passOpcoes) {
								msg += '- Informe ' + ((elemento.attributes && elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + '.\n';
								pass = false;
								marcaDesmarcaCampo(elemento, true);
								if (!campofoco) campofoco = elemento;
							}
						}
					}
					
					//Para otimizar o desempenho, só valida os formatos se passar por todos os obrigatórios
					if (pass && elemento.value != "" && (elemento.type.toLowerCase() == "text" || elemento.type.toLowerCase() == "textarea" || elemento.type.toLowerCase() == "password")) {
						//Tamanho =
						if(elemento.attributes.rel.value.indexOf("T") == 1 || elemento.attributes.rel.value.indexOf("T") == 2) {
							var segundo = elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf("T") + 1, elemento.attributes.rel.value.indexOf(' ', 1));
							
							if (console) console.log(segundo);
							
							if (elemento.value.length != Number(segundo)) {
								msgCompara += '- ' + ((elemento.attributes && elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' precisa ter ' + segundo + ' caracteres.\n'
								if (!campofoco) campofoco = elemento;
								marcaDesmarcaCampo(elemento, true);
								passCompara = false;
							}
						}
						
						//Comparação =
						if(elemento.attributes.rel.value.indexOf("=") == 1) {
							var segundo = document.getElementById(elemento.attributes.rel.value.substring(2, elemento.attributes.rel.value.indexOf(' ', 1)));
							
							if (elemento.value != segundo.value) {
								msgCompara += '- ' + ((elemento.attributes && elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' e ' + ((elemento.attributes && elemento.attributes.rel && elemento.attributes.rel.value != "#") ? segundo.attributes.rel.value.substring(segundo.attributes.rel.value.indexOf(' ', 1)) : segundo.name) + ' não batem.\n'
								if (!campofoco) campofoco = elemento;
								marcaDesmarcaCampo(elemento, true);
								passCompara = false;
							}
						}
						
						//Comparação >
						else if(elemento.attributes.rel.value.indexOf(">") == 1) {
							var segundo = document.getElementById(elemento.attributes.rel.value.substring(2, elemento.attributes.rel.value.indexOf(' ', 1)));
	
							if (isNaN(cnvvl(elemento.value)) || isNaN(cnvvl(segundo.value)) || cnvvl(elemento.value) < cnvvl(segundo.value)) {
								msgCompara += '- ' + ((elemento.attributes && elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' não pode ser menor que ' + ((elemento.attributes && elemento.attributes.rel && elemento.attributes.rel.value != "#") ? segundo.attributes.rel.value.substring(segundo.attributes.rel.value.indexOf(' ', 1)) : segundo.name) + '.\n'
								if (!campofoco) campofoco = elemento;
								marcaDesmarcaCampo(elemento, true);
								passCompara = false;
							}
						}
						
						//Comparação <
						else if(elemento.attributes.rel.value.indexOf("<") == 1) {
							var segundo = document.getElementById(elemento.attributes.rel.value.substring(2, elemento.attributes.rel.value.indexOf(' ', 1)));
	
							if (isNaN(cnvvl(elemento.value)) || isNaN(cnvvl(segundo.value)) || cnvvl(elemento.value) > cnvvl(segundo.value)) {
								msgCompara += '- ' + ((elemento.attributes && elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' não pode ser maior que ' + ((elemento.attributes && elemento.attributes.rel && elemento.attributes.rel.value != "#") ? segundo.attributes.rel.value.substring(segundo.attributes.rel.value.indexOf(' ', 1)) : segundo.name) + '.\n'
								if (!campofoco) campofoco = elemento;
								marcaDesmarcaCampo(elemento, true);
								passCompara = false;
							}
						}
						
						//Data
						else if (elemento.attributes.rel.value.indexOf("D") == 1) {
							if(!isValidDate(elemento.value)) {
								msgCompara += '- ' + ((elemento.attributes && elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' informada é inválida.\n';
								if (!campofoco) campofoco = elemento;
								marcaDesmarcaCampo(elemento, true);
								passCompara = false;
							}
						}
						
						//URL
						else if(elemento.attributes.rel.value.indexOf("U") == 1) {
							if (!elemento.value.match("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$")){
								msgCompara += '- ' + ((elemento.attributes && elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' informada é inválida.\n';
								if (!campofoco) campofoco = elemento;
								marcaDesmarcaCampo(elemento, true);
								passCompara = false;
							}
						}
						
						//E-mail
						else if(elemento.attributes.rel.value.indexOf("@") == 1) {
							if (!elemento.value.match("^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9]))$")){
								msgCompara += '- ' + ((elemento.attributes && elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' informado é inválido.\n';
								if (!campofoco) campofoco = elemento;
								marcaDesmarcaCampo(elemento, true);
								passCompara = false;
							}
						}
						
						//CPF
						else if(elemento.attributes.rel.value.indexOf("F") == 1 || elemento.attributes.rel.value.indexOf("J") == 1) {
							if (!validaCPFouCNPJ(elemento.value)) {
								msgCompara += '- ' + ((elemento.attributes && elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' informado é inválido.\n';
								if (!campofoco) campofoco = elemento;
								marcaDesmarcaCampo(elemento, true);
								passCompara = false;
							}
						}
						
						//Range(Ex.: "0-120" ou "01/01/2010-31/12/2010")
						else if(elemento.attributes.rel.value.indexOf("R") == 1) {
							var rel = elemento.attributes.rel.value;
							var inicio = rel.substring(3, rel.indexOf("-"));
							var final = rel.substring(rel.indexOf("-") + 1, rel.indexOf(" ", 1));
							var valor = elemento.value;
							
							//Números
							if (elemento.attributes.rel.value.indexOf("N") == 2) {
								inicio = cnvvl(inicio);
								final = cnvvl(final);
								valor = cnvvl(valor);
								
								if (valor < inicio || valor > final) {
									msgCompara += '- ' + ((elemento.attributes && elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' está fora do intervalo válido (' + inicio + ' à ' + final + ').\n';
									if (!campofoco) campofoco = elemento;
									marcaDesmarcaCampo(elemento, true);
									passCompara = false;
								}
							}
							
							//Datas
							if (elemento.attributes.rel.value.indexOf("D") == 2) {
								inicio = new Date(cnvdtUS(inicio));
								final = new Date(cnvdtUS(final));
								valor = new Date(cnvdtUS(valor));
								
								if (isNaN(inicio) || isNaN(final) || isNaN(valor) || valor < inicio || valor > final) {
									msgCompara += '- ' + ((elemento.attributes && elemento.attributes.rel && elemento.attributes.rel.value != "#") ? elemento.attributes.rel.value.substring(elemento.attributes.rel.value.indexOf(' ', 1)) : elemento.name) + ' está fora do intervalo válido (' + inicio + ' à ' + final + ').\n';
									if (!campofoco) campofoco = elemento;
									marcaDesmarcaCampo(elemento, true);
									passCompara = false;
								}
							}
						}
					}
				}
			} else if(elemento.type.toLowerCase() == 'image' || elemento.type.toLowerCase() == 'submit' || elemento.type.toLowerCase() == 'button' || elemento.type.toLowerCase() == 'reset') {
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
	
	if (window.event) window.event.returnValue = pass;
	
	return pass;
}

function SomenteNumeros(campo, event) {
	return limitarEntrada(campo, event, /[0-9]/);
}

function SomenteNumerosDecimais(campo, event) {
	return limitarEntrada(campo, event, /[0-9,]/);
}

function SomenteLetras(campo, event) {
	return limitarEntrada(campo, event, /[a-zA-Z]/);
}

function SemNumeros(campo, event) {
	return limitarEntrada(campo, event, /[^0-9]/);
}

function formatar(campo, mascara, event, chave) {
	var e = (!window.event) ? event : window.event;

	if (e && (e.type == "keypress" || e.type == "keyup" || e.type == "keydown")) {
		var code = (!e.which) ? ((!e.charCode) ? e.keyCode : e.charCode) : e.which;
		
		if (code == 8 || code == 9 || code == 13 || code == 46 || code == 116 || (e.ctrlKey && (code == 67 || code == 86 || code == 88 || code == 90))) return; //backspace, tab, enter, delete, F5 e CTRL + C ou V
	}
	
	var tamanho = campo.value.length;
	
	var atual = mascara.substr(tamanho, 1);
	chave = (!chave) ? "#" : chave;
	
	if (atual != chave) campo.value += atual;
}

function maiusculas(campo) {
	campo.value = campo.value.toUpperCase();
}

function minusculas(campo) {
	campo.value = campo.value.toLowerCase();
}

// colocar no keydown e no keyup
function limitaTextarea(txt, event) {
	var e = (!window.event) ? event : window.event;
	var limite = Number((txt.maxlength) ? txt.maxlength : txt.attributes.maxlength);
	var total = txt.value.length;
	
	if (e.type == "keyup") total++;
	
	if (total > limite) txt.value = txt.value.substr(0, limite);
	
	var code = (!e.which) ? ((!e.charCode) ? e.keyCode : e.charCode) : e.which;
		
	if (code == 8 || code == 9 || code == 13 || code == 46 || code == 116 || (e.ctrlKey && (code == 67 || code == 86 || code == 88 || code == 90))) {
		return true;
	} else {
		return (total < limite);
	}
}

function limitarEntrada(campo, event, expressao) {
	var e = (!window.event) ? event : window.event;
	var valido = true;
	
	if (e.type == "keypress" || e.type == "keyup" || e.type == "keydown") {
		var code = (!e.which) ? ((!e.charCode) ? e.keyCode : e.charCode) : e.which;
		
		if (code == 8 || code == 9 || code == 13 || code == 46 || code == 116 || (e.ctrlKey && (code == 67 || code == 86 || code == 88 || code == 90))) return true; //backspace, tab, enter, delete, F5 e CTRL + C ou V
		
		valido = String.fromCharCode(code).match(expressao);
	}
	
	if (e.cancelBubble) e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	if (e.returnValue) e.returnValue = (valido != null) ? valido : false;
	return valido != null;
}

function formataValor(campo) {
	var valor = campo.value;
	
	if (valor != "") {
		campo.value = String(Number(valor.replace(/\./g, "").reverse().replace(/,/, ".").replace(/,/g, "").reverse()).toFixed(2)).replace(/\./g, ",");
	}
}


function marcaDesmarcaCampo(qual, marcar) {
	qual.style.borderColor = (marcar) ? "#CC0000" : "";
	qual.style.backgroundColor = (marcar) ? "#FFCCCC" : "";
}


function cnvdtUS(data) {
	data = String(data);
	var dia = data.substr(0, data.indexOf("/"));
	var mes = data.substr(data.indexOf("/") + 1, data.lastIndexOf("/") - data.indexOf("/") - 1);
	var ano = data.substr(data.lastIndexOf("/") + 1, data.length - data.lastIndexOf("/"));
	
	return (mes + "/" + dia + "/" + ano);
}

function cnvvl(valor) {
	return Number(String(valor).replace(/\./g, "").replace(/,/, "."));
}

function numStr(numero) {
	return String(numero).reverse().replace(/,/g, "").replace(/\./, ",").replace(/\./g, "").reverse();
}

function validaCPFouCNPJ(valor) {
	var numero = valor.replace(/\D/ig, "");

	if (numero.length != 11 && numero.length != 14) {
		return false;
	
	} else if (numero.length == 11) {
		return CalculaCPF(numero);
	
	} else {
		return CalculaCNPJ(numero);
	}
}


function CalculaCNPJ(varCNPJ) {
	var RecebeCNPJ, Numero = new Array(15), soma, resultado1, resultado2;
	RecebeCNPJ = varCNPJ;

	if (RecebeCNPJ.length != 14) {
		return false;
	} else if (RecebeCNPJ == "00000000000000" || RecebeCNPJ === "11111111111111" || RecebeCNPJ === "22222222222222" || RecebeCNPJ == "33333333333333" || RecebeCNPJ == "44444444444444" || RecebeCNPJ == "55555555555555" || RecebeCNPJ == "66666666666666" || RecebeCNPJ == "77777777777777" || RecebeCNPJ == "88888888888888" || RecebeCNPJ == "99999999999999") {
		return false;
	} else {
		Numero = (" "+RecebeCNPJ).split("");
	
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
				//CNPJ Válido;
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}

function CalculaCPF(varCPF) {
	var RecebeCPF, Numero = new Array(12), soma, resultado1, resultado2;
	RecebeCPF = varCPF;
	
	if (RecebeCPF.length != 11) {
		return false;
	} else if (RecebeCPF == "00000000000" || RecebeCPF == "11111111111" || RecebeCPF == "22222222222" || RecebeCPF == "33333333333" || RecebeCPF == "44444444444" || RecebeCPF == "55555555555" || RecebeCPF == "66666666666" || RecebeCPF == "77777777777" || RecebeCPF == "88888888888" || RecebeCPF == "99999999999") {
		return false;
	} else {
		Numero = (" "+RecebeCPF).split("");

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
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}

function isValidDate(dateStr) {
	var datePat = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
	
	var matchArray = dateStr.match(datePat);
	if (matchArray == null) {
		return false;
	}
	
	day = matchArray[1];
	month = matchArray[2];
	year = matchArray[3];
	
	if (month < 1 || month > 12) return false;
	
	if (day < 1 || day > 31) return false;
	
	if ((month==4 || month==6 || month==9 || month==11) && day==31) return false;
	
	if (month == 2) { // bissexto
		var bissexto = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
		if (day>29 || (day==29 && !bissexto))  return false;
	}
	return true;
}


function completar(texto, tamanho, caractere) {
	var completo = texto;
	
	if (!isNaN(Number(tamanho)) && caractere != "") {
		var tamanhoAntigo = texto.length;
		for (var i = tamanhoAntigo; i < tamanho; i++) {
			completo = catactere + completo;
		}
	}
	
	return completo;
}


String.prototype.reverse = function() {
	var tmp = "";
	var texto = this.split("");
	
	for (var i = texto.length - 1; i >= 0; i--)  tmp += texto[i];
	
	return tmp;
}

String.prototype.trim = function() {
	return this.replace(/(^\s+)|(\s+$)/g, "");
}