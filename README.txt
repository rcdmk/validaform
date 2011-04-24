# VALIDACAO GERAL DE FORMULARIOS POR RCDMK
#
# USO das validacoes
# Insira um atributo "rel" no campo para validar:
# 	- Preenchimento obigatorio: o primeiro caractere do atributo tem que ser um # e o restante, separado por um espaco, sera utilizado na mensagem de erro. Ex.: rel="# o nome do campo"
# 	- Validacao de e-mail: o segundo caractere do atributo tem que ser @. Ex.: rel="#@ o e-mail de contato" (obrigatorio) ou rel=" @ o e-mail de contato" (nao obrigatorio)
# 	- Validacao de CPF: o segundo caractere tem que ser F (de pessoa Fisica);
# 	- Validacao de CNPJ: o segundo caractere tem que ser J (de pessoa Juridica);
# 	- Validacao de tamanho ou comprimento do valor: o segundo caractere tem que ser T e o terceiro o tamanho a ser validado. Ex.: rel="#T9 o telefone"
# 	- Validacao por comparacao igual (senha e confirmacao de senha, etc): o segundo caractere tem que ser = e o terceiro o ID do campo a ser comparado. Ex.: rel="#=confirmaSenha a senha"
