# Protótipo e decisões de design

Planejei um web app com duas áreas: a vitrine acessível ao cliente e a gestão utilizada pela equipe. Usei o estudo de caso da Dona Clara como referência e organizei a experiência em torno do pedido para retirada.

## Telas que desenhei

1. **Início:** apresento a marca e a proposta artesanal, com uma chamada para o cardápio.
2. **Cardápio:** mostro categorias, produtos, preços, variações e saldo disponível.
3. **Pedido:** reúno itens, quantidades, total e informações da retirada em um painel lateral.
4. **Confirmação de recebimento:** mostro o número da encomenda e o acesso ao acompanhamento.
5. **Acompanhamento:** apresento os itens, a retirada e o status atualizado.
6. **Entrada da equipe:** solicito a senha na versão com servidor.
7. **Gestão de encomendas:** organizo busca, filtros, itens, observações e ações de status.
8. **Disponibilidade:** permito atualizar o saldo livre para novos pedidos.

![Wireframe](wireframe.svg)

## Fluxo que implementei

Cliente: início → cardápio → escolha de sabor e quantidade → revisão do pedido → dados de retirada → envio → acompanhamento.

Equipe: entrada → lista de encomendas → confirmação → preparo → pronto → retirado. Permito cancelar antes da retirada e devolver os itens ao saldo disponível.

## Relação com o estudo de caso

| Referência | Problema que identifiquei | Decisão que tomei |
| --- | --- | --- |
| Seção 1 — Cenário Atual | Anotações em caderno e atendimento no balcão | Estruturei os dados da encomenda e a lista de gestão. |
| Seção 2 — Dor do Cliente | Fila e risco de falta do produto | Permiti solicitar retirada e reservar a quantidade disponível. |
| Seção 2 — Dor do Cliente | Trocas de sabores e atrasos | Exibi o sabor em cada item e validei antecedência e horário. |
| Seção 3 — Informações Adicionais | Presença digital fraca e oportunidade de coffee breaks | Criei uma vitrine pública e uma opção de encomenda para empresas. |
| Seção 4 — Instruções | Autonomia para escolher a solução | Escolhi o web app para atender o cliente e organizar a equipe. |
| Seção 5 — Avaliação | Protótipo e repositório profissional | Registrei as telas, a justificativa e a execução no README. |

## Direção visual

Escolhi verde, creme e tons de pão para a identidade da Dona Clara. Combinei títulos serifados com textos de leitura simples. Usei ilustrações originais em CSS e SVG, sem depender de fotografias de outras padarias. Mantive o foco no produto, no pedido e no retorno claro das ações.

## Escopo da apresentação

Implementei o fluxo centralizado com Node.js e persistência em arquivo. Para o Pages, ofereço o mesmo fluxo com armazenamento no navegador, adequado à apresentação no mesmo dispositivo. Documentei essa diferença no README para não confundir a publicação estática com um servidor de pedidos.
