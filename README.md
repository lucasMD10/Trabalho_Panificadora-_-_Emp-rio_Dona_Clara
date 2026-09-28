# Dona Clara — Panificadora & Empório

Projeto individual da disciplina **Design Profissional — Produção de Portfólio & Desenvolvimento Empresarial**, baseado no estudo de caso da Panificadora & Empório Dona Clara. Desenvolvido por **Lucas Marcondes Delfino**.

## Problema e proposta

No caso fornecido, os pedidos são feitos no balcão e as encomendas são anotadas manualmente. Os clientes procuram praticidade para escolher antes de ir à loja, enquanto a padaria enfrenta filas, produtos esgotados e erros de sabor ou prazo.

Escolhi um **site responsivo de pré-encomendas para retirada**. Ele combina apresentação da marca com catálogo, seleção de variações, carrinho e preenchimento padronizado dos dados de retirada. Um link funciona no celular e no computador sem exigir instalação de aplicativo. Um dashboard isolado ajudaria a equipe, mas não abriria um canal para o cliente fazer a encomenda.

## Protótipo e telas

O [protótipo documentado](docs/prototipo.md) descreve a página inicial, o cardápio, o painel do pedido, o fluxo do cliente, as decisões visuais e a relação entre cada funcionalidade e a dor do caso. O [wireframe visual](docs/wireframe.svg) apresenta as telas principais. O site implementado é navegável e serve como protótipo interativo.

![Wireframe da página inicial e do painel de pedido](docs/wireframe.svg)

## O que funciona

- Filtro do cardápio por pães, doces e encomendas.
- Escolha de sabor ou opção nos itens aplicáveis.
- Adição e remoção de itens, com total estimado atualizado.
- Formulário com nome, telefone, data, horário e observações.
- Geração e cópia de um resumo estruturado da solicitação.
- Layout responsivo e navegação por teclado, incluindo painel do pedido.

**Importante:** esta é uma demonstração acadêmica. O formulário não envia dados a uma padaria real, não registra pedidos em servidor e não consulta estoque. A cópia do resumo demonstra a padronização da encomenda; para uso real, seria necessário integrar o recebimento dos pedidos, confirmar disponibilidade e definir a operação interna. Por isso a interface usa “solicitação” e informa que a retirada depende de confirmação. Produtos, preços e identidade visual são ilustrativos.

## Arquitetura

Site estático sem dependências de build: `index.html` organiza as seções e o formulário; `styles.css` define a interface responsiva; `script.js` mantém o catálogo e o estado temporário do carrinho no navegador. O favicon original está em `assets/`. Não há backend, banco de dados, login ou credenciais. As fontes DM Sans e Fraunces são carregadas pelo Google Fonts, com alternativas locais.

```text
.
├── assets/favicon.svg
├── docs/prototipo.md
├── docs/wireframe.svg
├── index.html
├── styles.css
├── script.js
├── .gitignore
├── LICENSE
└── README.md
```

## Como executar

Abra `index.html` no navegador. Para testar com um servidor local, na pasta do projeto execute `python -m http.server 8000` e abra `http://localhost:8000`. Não é necessário instalar pacotes.

## Publicação

O projeto pode ser publicado em **Settings → Pages → Deploy from a branch → main → /(root)**. Após a ativação, o endereço ficará disponível na seção Pages do repositório. O código e o protótipo continuam acessíveis pelo GitHub.

## Próximos passos para um uso real

Validar cardápio, preços, identidade, endereço, horários e regras de antecedência com Clara e Roberto; adicionar um canal de recebimento e uma lista interna de pedidos; estabelecer confirmação e atualização de disponibilidade. Esses dados e processos não foram especificados no estudo de caso.

## Licença

Código sob licença [MIT](LICENSE). O estudo de caso acadêmico original não está incluído neste repositório.
