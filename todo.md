# First Steps
- [ ] Create Database Schema
- [ ] Connect Database
- [ ] Create Auth System
- [ ] Create Login Page
- [ ] Create admin page
- [ ] Check Permissions  
###
# Dashboard

- [ ] Create Category
- [ ] Manage Products
  - [ ] Create Product
    - [ ] Upload Image
    - [ ] Nome
    - [ ] Preço
    - [ ] Código Organizador
    - [ ] Foto
    - [ ] Quantidade
  - [ ] View Products
    - [ ] Sort Products
    - [ ] Filter Products
  - [ ] Edit Products
###
# Customers Page
- [ ] Header
  - [ ] NavBar
  - [ ] Dynamic Categories
- [ ] View Products
  - [ ] Filter Products
  - [ ] Sort Products
    - [ ] Price
  - [ ] View Products
- [ ] Add Products to Cart
  - [ ] Comprar
    - [ ] Send to whatsapp with selected products and overall price
- [ ] Footer

# Future
- [ ] Featured Collection
  - [ ] Create a Collection
  - [ ] Assign Products to Collection
  - [ ] Choose or disable featured collection: limit 1

Features:
- [ ] Search by code
- [ ] Search by name
- [ ] Search by category
- [ ] Link product to customerGroup

Notes:
- Collections are for sales
- Categories are for type of products
- Codes are for internal organization
- Customer group are for internal organization

# Relatórios
 - Perído de Venda
 - Lista de todos os produtos - número de vendas
 - Primeira linha: número total de vendas, - lucro total, método de pagamento, taxa total



# Others
- Add product to collection
- - Set collection as featured

# TODO

  > Criar meio de pagamento (valor fixo) DONE
  > Lançamento de vendas
    -> Seleciona o grupo de clientes ok
    -> Seleciona o pagamento ok
    -> Seleciona a data da venda ok
    -> Pesquisa por código os produtos
      -> Seleciona o produto ok
      -> Adiciona o produto à box abaixo, onde pode mudar a quantidade e ver o total de vendas e n de produtos ok
    -> Save
Missing:
-> Estilo do seletor de data
-> Backend para enviar a venda
-> Talvez trocar a posição da data com o meio de pagamento?
-> Visualizar a venda em tabela com os mesmos controles que o cadastro
  > Relatório
  > Seleciona o período
  > Lista de todos os produtos - número de vendas - valor de venda - custo - lucro total - taxa total
  > Filtros:
    - Categoria
    - Grupos
    - Pagamento

Feito: Selecionar o pagamento from DB, SelectCustomQuery
  -> Upload de imagem

  -> Ocultar o lucro e o valor (toggle)
  -> Codigo do lado e antes do nome
  -> Confirmar delete na tabela
  -> Adicionar produto à coleção

  -> Homepage
  -> Top bar
  -> carrossel de categorias
  -> sidebar com categorias e coleções
  -> lista de produtos com filtros em query string:
    - categoria
    - coleção
    - search
    - price sort


##

-> Criar os inputs dos filtros
-> Modificar inputs para selecionar mais de uma opção