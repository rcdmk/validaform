# VALIDAÇÃO GERAL DE FORMUL�RIOS POR RCDMK
#
# USO das validações:
# Insira um atributo "rel" no campo para validar:
# 	- Preenchimento obigatório: o primeiro caractere do atributo tem que ser um # e o restante, separado por um espaço, será utilizado na mensagem de erro. Ex.: rel="# o nome do campo"
# 	- Validação de e-mail: o segundo caractere do atributo tem que ser @. Ex.: rel="#@ o e-mail de contato" (obrigatório) ou rel=" @ o e-mail de contato" (não obrigatório)
# 	- Validação de CPF: o segundo caractere tem que ser F (de pessoa Física);
# 	- Validação de CNPJ: o segundo caractere tem que ser J (de pessoa Jurídica);
# 	- Validação de tamanho ou comprimento do valor: o segundo caractere tem que ser T e o terceiro o tamanho a ser validado. Ex.: rel="#T9 o telefone"
# 	- Validação por comparação igual (senha e confirmação de senha, etc): o segundo caractere tem que ser = e o terceiro o ID do campo a ser comparado. Ex.: rel="#=confirmaSenha a senha"
#
# This is a old project somewhat reinventing the weel to use in any web
# project for client-side javascript validation of form data.
