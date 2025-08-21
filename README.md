# API Financeira

## Requisitos funcionais

- [ ] O usuário deve poder criar uma nova transação;
- [ ] O usuário deve poder listar todas as transações;
- [ ] O usuário deve poder listar uma única transação por ID;
- [ ] O usuário deve poder atualizar uma transação por ID;
- [ ] O usuário deve poder deletar uma transação por ID;

## Regras de negócio

- [ ] A transação pode ser do tipo **crédito** (soma ao valor total) ou **débito** (subtrai do valor total);
- [ ] O valor da transação (`amount`) deve ser sempre um número positivo. O `type` da transação define se é uma entrada ou saída;
- [ ] O título (`title`) da transação é obrigatório;
- [ ] Deve ser possível identificar o usuário entre as requisições através de um `sessionId` armazenado nos cookies;
- [ ] O usuário só pode visualizar, editar e apagar as transações que ele mesmo criou (mesma `sessionId`);
- [ ] O usuário deve poder visualizar um resumo da sua conta, incluindo o saldo total;
