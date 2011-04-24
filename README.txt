<<<<<<< HEAD
# VALIDAÇÃO GERAL DE FORMULÁRIOS POR RCDMK - Agosto de 2010
#
# USO das validações
# Insira um atributo "rel" no campo para validar:
# 	- Preenchimento obigatório: o primeiro caractere do atributo tem que ser um # e o restante, separado por um espaço, será utilizado na mensagem de erro. Ex.: rel="# o nome do campo"
# 	- Validação de e-mail: o segundo caractere do atributo tem que ser @. Ex.: rel="#@ o e-mail de contato" (obrigatório) ou rel=" @ o e-mail de contato" (não obrigatório)
# 	- Validação de CPF: o segundo caractere tem que ser F (de pessoa Física);
# 	- Validação de CNPJ: o segundo caractere tem que ser J (de pessoa Jurídica);
# 	- Validação de tamanho ou comprimento do valor: o segundo caractere tem que ser T e o terceiro o tamanho a ser validado. Ex.: rel="#T9 o telefone"
# 	- Validação por comparação igual (senha e confirmação de senha, etc): o segundo caractere tem que ser = e o terceiro o ID do campo a ser comparado. Ex.: rel="#=confirmaSenha a senha"
=======
# VALIDAÃ‡ÃƒO GERAL DE FORMULï¿½RIOS POR RCDMK
#
# USO das validaÃ§Ãµes:
# Insira um atributo "rel" no campo para validar:
# 	- Preenchimento obigatÃ³rio: o primeiro caractere do atributo tem que ser um # e o restante, separado por um espaÃ§o, serÃ¡ utilizado na mensagem de erro. Ex.: rel="# o nome do campo"
# 	- ValidaÃ§Ã£o de e-mail: o segundo caractere do atributo tem que ser @. Ex.: rel="#@ o e-mail de contato" (obrigatÃ³rio) ou rel=" @ o e-mail de contato" (nÃ£o obrigatÃ³rio)
# 	- ValidaÃ§Ã£o de CPF: o segundo caractere tem que ser F (de pessoa FÃ­sica);
# 	- ValidaÃ§Ã£o de CNPJ: o segundo caractere tem que ser J (de pessoa JurÃ­dica);
# 	- ValidaÃ§Ã£o de tamanho ou comprimento do valor: o segundo caractere tem que ser T e o terceiro o tamanho a ser validado. Ex.: rel="#T9 o telefone"
# 	- ValidaÃ§Ã£o por comparaÃ§Ã£o igual (senha e confirmaÃ§Ã£o de senha, etc): o segundo caractere tem que ser = e o terceiro o ID do campo a ser comparado. Ex.: rel="#=confirmaSenha a senha"
>>>>>>> f3a2bf5126c1d1d6facf83e8ce59af12b1712eb0
#
# This is a old project somewhat reinventing the weel to use in any web
# project for client-side javascript validation of form data.
