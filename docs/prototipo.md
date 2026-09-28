# Protótipo e fluxo de navegação

O protótipo navegável é a própria interface implementada em `index.html`. Este documento registra as telas e as decisões que orientaram o desenvolvimento.

## 1. Página inicial

**Objetivo:** apresentar a panificadora, sua proposta artesanal e um acesso direto ao cardápio.

- Cabeçalho: marca, links para Cardápio, Como funciona e Nossa história, botão Meu pedido.
- Destaque: mensagem principal, chamada para explorar o cardápio, ilustração de pães.
- Cardápio: filtros por categoria e produtos com preço ilustrativo, descrição e botão Adicionar.
- Como funciona: três passos que deixam claro que o pedido exige confirmação.
- Nossa história: tradição da Dona Clara e convite para escolher produtos.

## 2. Seleção de produto

O cliente pode filtrar itens, escolher sabor ou opção nos produtos que possuem variações e adicioná-los ao pedido. O contador no cabeçalho indica a quantidade total. O carrinho permite aumentar ou diminuir cada item.

## 3. Pedido e retirada

No painel lateral, o cliente confere os itens e o total estimado, preenche nome, telefone, data, horário desejado e observações. Ao concluir, a demonstração copia um resumo estruturado. Não há envio real nem reserva de estoque.

**Caminho:** início → cardápio → variação e produto → meu pedido → dados de retirada → resumo copiado → confirmação posterior pela padaria.

## 4. Relação com as dores do caso

| Dor apresentada | Resposta no protótipo | Limite desta versão |
| --- | --- | --- |
| Cliente precisa encomendar sem fila | Seleção de produtos e dados de retirada no site | O resumo precisa ser encaminhado à padaria fora da demonstração |
| Trocas de sabores e dados perdidos | Variações e campos padronizados no resumo | Não há painel interno nem banco de dados |
| Produto pode acabar | Aviso de confirmação obrigatória | Não há estoque em tempo real |
| Pouca presença digital | Página pública com história e catálogo | Conteúdo e identidade visual precisam ser validados com o negócio |

## 5. Decisões visuais

Paleta verde, creme e tons de pão; tipografia de leitura simples combinada com títulos editoriais; composição responsiva para celular e computador. A ilustração foi construída no próprio CSS, sem fotos de terceiros.

O cardápio, os preços, a marca gráfica e os dados de operação são **hipóteses para o estudo acadêmico**, não informações fornecidas pelo enunciado.
