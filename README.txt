# VALIDA��O GERAL DE FORMUL�RIOS POR RCDMK - Agosto de 2010
#
# USO das valida��es
# Insira um atributo "rel" no campo para validar:
# 	- Preenchimento obigat�rio: o primeiro caractere do atributo tem que ser um # e o restante, separado por um espa�o, ser� utilizado na mensagem de erro. Ex.: rel="# o nome do campo"
# 	- Valida��o de e-mail: o segundo caractere do atributo tem que ser @. Ex.: rel="#@ o e-mail de contato" (obrigat�rio) ou rel=" @ o e-mail de contato" (n�o obrigat�rio)
# 	- Valida��o de CPF: o segundo caractere tem que ser F (de pessoa F�sica);
# 	- Valida��o de CNPJ: o segundo caractere tem que ser J (de pessoa Jur�dica);
# 	- Valida��o de tamanho ou comprimento do valor: o segundo caractere tem que ser T e o terceiro o tamanho a ser validado. Ex.: rel="#T9 o telefone"
# 	- Valida��o por compara��o igual (senha e confirma��o de senha, etc): o segundo caractere tem que ser = e o terceiro o ID do campo a ser comparado. Ex.: rel="#=confirmaSenha a senha"
#
# This is a old project somewhat reinventing the weel to use in any web
# project for client-side javascript validation of form data.
