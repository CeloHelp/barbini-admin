Brief do projeto

Nome provisório do projeto
Painel Administrativo Web para Gestão de Orçamentos

Contexto
O projeto surge como um complemento ao ecossistema de uma aplicação mobile já existente, voltada para a criação e organização de orçamentos. Enquanto o aplicativo mobile atende melhor o uso operacional e prático, a proposta desta nova aplicação web é oferecer uma visão mais administrativa e gerencial das informações, permitindo consulta, acompanhamento e organização de dados em um ambiente centralizado.

Ideia central
Desenvolver uma aplicação web simples e funcional, hospedada em nuvem, que permita a gestão de clientes, produtos e orçamentos, servindo como painel administrativo do sistema.

Problema que o projeto busca resolver
Em soluções focadas apenas no uso mobile, a gestão administrativa costuma ficar limitada, principalmente para visualização ampla dos dados, conferência de registros e acompanhamento de orçamentos. Assim, o painel web surge para centralizar essas informações e facilitar a gestão do sistema de forma mais confortável e organizada.

Objetivo geral
Criar e implantar em nuvem uma aplicação web administrativa que complemente a aplicação mobile de orçamentos, oferecendo recursos de consulta, cadastro e acompanhamento de informações do sistema.

Objetivos específicos

disponibilizar um painel web com acesso por login
permitir o cadastro e gerenciamento de clientes
permitir o cadastro e gerenciamento de produtos
exibir a listagem de orçamentos já registrados
permitir a visualização detalhada de cada orçamento
apresentar indicadores simples em dashboard
hospedar a aplicação em ambiente de nuvem

Público de uso

administrador do sistema
gestor
responsável pelo acompanhamento dos orçamentos

Proposta de valor
A aplicação web não substitui o mobile, mas amplia o ecossistema do sistema ao oferecer uma interface mais adequada para controle administrativo, organização dos dados e visualização gerencial.

Escopo do MVP
O MVP inicial será composto por:

tela de login
dashboard com indicadores
cadastro e listagem de clientes
cadastro e listagem de produtos
listagem de orçamentos
visualização dos detalhes do orçamento

Diferencial do projeto
O diferencial está em transformar uma solução antes concentrada no uso local/mobile em um pequeno ecossistema mais completo, com um módulo web administrativo hospedado em nuvem.

Resultado esperado
Ao final, o projeto deve apresentar uma aplicação web funcional, simples e organizada, capaz de demonstrar:

uso de computação em nuvem
deploy de aplicação web
persistência de dados
visão administrativa do sistema
integração conceitual com o app mobile já existente
Rascunho textual das telas do MVP
1. Tela de Login

Objetivo da tela
Permitir o acesso ao painel administrativo.

Estrutura da tela

fundo neutro e limpo
card centralizado
logotipo ou nome do sistema na parte superior
título: “Entrar no painel”
subtítulo curto: “Acesse sua conta para continuar”
campo de e-mail
campo de senha
botão principal: “Entrar”
link discreto: “Esqueci minha senha” opcional
área para mensagem de erro em caso de falha no login

Rascunho textual
Topo do card:

Nome do sistema
Texto de apoio

Corpo:

Input de e-mail
Input de senha
Botão entrar

Rodapé:

Link de recuperação de senha
2. Tela de Dashboard

Objetivo da tela
Ser a página inicial após o login e apresentar uma visão geral do sistema.

Estrutura da tela

menu lateral fixo à esquerda
topo horizontal com nome da página e nome do usuário
área principal com cards de indicadores
lista ou tabela de orçamentos recentes

Menu lateral

Dashboard
Clientes
Produtos
Orçamentos
Sair

Conteúdo principal
Cabeçalho:

título: “Dashboard”
pequeno texto de boas-vindas opcional

Cards de indicadores:

total de clientes
total de produtos
total de orçamentos
valor total orçado

Seção inferior:

título: “Orçamentos recentes”
tabela com colunas:
número
cliente
data
valor total
status

Rascunho textual
Lateral esquerda:

logo
navegação

Topo:

Dashboard
nome do usuário

Centro:

4 cards de resumo
tabela de orçamentos recentes
3. Tela de Listagem de Clientes

Objetivo da tela
Exibir os clientes cadastrados e permitir ações de gerenciamento.

Estrutura da tela

título da página: “Clientes”
botão principal: “Novo cliente”
barra de busca por nome
tabela com listagem dos clientes

Tabela
Colunas:

nome
telefone
e-mail
data de cadastro
ações

Ações

visualizar
editar
excluir

Rascunho textual
Topo da página:

título “Clientes”
botão “Novo cliente”

Área abaixo:

campo de busca

Centro:

tabela de clientes com ações no final de cada linha
4. Tela de Cadastro de Cliente

Objetivo da tela
Cadastrar um novo cliente no sistema.

Estrutura da tela

título: “Novo cliente”
formulário em card ou bloco central
campos organizados verticalmente
botões ao final

Campos

nome completo
telefone
e-mail
observações

Botões

salvar
cancelar

Rascunho textual
Topo:

título “Novo cliente”

Formulário:

nome completo
telefone
e-mail
observações

Rodapé do formulário:

botão salvar
botão cancelar
5. Tela de Edição de Cliente

Objetivo da tela
Editar as informações de um cliente já existente.

Estrutura da tela
Praticamente igual à de cadastro, mudando apenas o título e preenchendo os campos com os dados atuais.

Título

“Editar cliente”

Campos

nome completo
telefone
e-mail
observações

Botões

salvar alterações
cancelar

Rascunho textual
Topo:

título “Editar cliente”

Formulário:

mesmos campos do cadastro já preenchidos

Rodapé:

salvar alterações
cancelar
6. Tela de Listagem de Produtos

Objetivo da tela
Exibir os produtos cadastrados e permitir seu gerenciamento.

Estrutura da tela

título: “Produtos”
botão principal: “Novo produto”
campo de busca
filtro de status opcional
tabela de produtos

Tabela
Colunas:

nome do produto
descrição curta
preço
status
ações

Ações

visualizar
editar
excluir

Rascunho textual
Topo:

título “Produtos”
botão “Novo produto”

Área de filtros:

campo de busca
filtro por status opcional

Centro:

tabela com produtos e ações
7. Tela de Cadastro de Produto

Objetivo da tela
Cadastrar um novo produto no sistema.

Estrutura da tela

título: “Novo produto”
formulário principal
campos organizados em bloco
botões ao final

Campos

nome do produto
descrição
preço
unidade opcional
status

Botões

salvar
cancelar

Rascunho textual
Topo:

título “Novo produto”

Formulário:

nome do produto
descrição
preço
unidade
status

Rodapé:

salvar
cancelar
8. Tela de Edição de Produto

Objetivo da tela
Editar um produto já cadastrado.

Estrutura
Mesma base da tela de cadastro.

Título

“Editar produto”

Campos

nome do produto
descrição
preço
unidade
status

Botões

salvar alterações
cancelar
9. Tela de Listagem de Orçamentos

Objetivo da tela
Permitir a consulta dos orçamentos registrados.

Estrutura da tela

título: “Orçamentos”
linha de filtros
tabela de orçamentos

Filtros

cliente
data
status
botão “Filtrar”

Tabela
Colunas:

número do orçamento
cliente
data
valor total
status
ação

Ação disponível

visualizar detalhes

Rascunho textual
Topo:

título “Orçamentos”

Linha abaixo:

filtro por cliente
filtro por data
filtro por status
botão filtrar

Centro:

tabela de orçamentos
10. Tela de Detalhes do Orçamento

Objetivo da tela
Mostrar as informações completas de um orçamento.

Estrutura da tela

título: “Detalhes do orçamento”
card com dados gerais
card com dados do cliente
tabela de itens do orçamento
card final com resumo financeiro

Bloco 1: dados gerais

número do orçamento
data
status

Bloco 2: dados do cliente

nome
telefone
e-mail

Bloco 3: itens
Tabela com:

produto
quantidade
preço unitário
subtotal

Bloco 4: resumo

subtotal
desconto
total final

Botões

voltar
exportar PDF opcional no futuro

Rascunho textual
Topo:

título “Detalhes do orçamento”

Corpo:

card de informações gerais
card do cliente
tabela dos itens
card com valores finais

Rodapé:

botão voltar
11. Modal de Confirmação de Exclusão

Objetivo
Confirmar exclusão de cliente ou produto.

Estrutura

título: “Confirmar exclusão”
texto: “Deseja realmente excluir este item?”
botão cancelar
botão excluir

Rascunho textual
Card/modal central:

título
mensagem
ações
Estrutura de navegação do MVP

O fluxo principal pode ser pensado assim:

Login
→ Dashboard
→ Clientes
→ Novo cliente / Editar cliente
→ Produtos
→ Novo produto / Editar produto
→ Orçamentos
→ Detalhes do orçamento