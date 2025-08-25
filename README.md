# API Financeira

## Requisitos funcionais

- [X] O usuário deve poder criar uma nova transação;
- [X] O usuário deve poder listar todas as transações;
- [X] O usuário deve poder listar uma única transação por ID;
- [ ] O usuário deve poder atualizar uma transação por ID;
- [ ] O usuário deve poder deletar uma transação por ID;

## Regras de negócio

- [X] A transação pode ser do tipo **crédito** (soma ao valor total) ou **débito** (subtrai do valor total);
- [ ] O valor da transação (`amount`) deve ser sempre um número positivo. O `type` da transação define se é uma entrada ou saída;
- [X] O título (`title`) da transação é obrigatório;
- [X] Deve ser possível identificar o usuário entre as requisições através de um `sessionId` armazenado nos cookies;
- [X] O usuário só pode visualizar, editar e apagar as transações que ele mesmo criou (mesma `sessionId`);
- [X] O usuário deve poder visualizar um resumo da sua conta, incluindo o saldo total;
