# WorkSpace — Gestão de Espaços Coworking

Projeto Angular para cadastro e gestão de salas e ambientes de coworking.

## Executar

```sh
npm ci
npm start
```

Acesse http://localhost:4200. Para validar: `npm run build` e `npm test -- --watch=false`.

Para executar a versão compilada com renderização no servidor, use `npm run serve:ssr:WorkSpace` após o build. Os arquivos são gerados em `dist/WorkSpace`.

## Funcionalidades

- Listagem e busca por nome, localização, tipo ou recurso; filtro de disponibilidade.
- Detalhes com capacidade, recursos e preço por hora em reais.
- Cadastro, edição e exclusão na Área de gestão.
- Interface `Espaco` com os oito campos do tema e identificador numérico.

## Persistência

A integração existente com Firebase Realtime Database foi mantida. O serviço `src/app/core/services/espaco.service.ts` usa a coleção `/espacos` no banco previamente configurado. Os registros de `/barracas` não são migrados nem alterados. A nova coleção começa vazia.

As operações dependem de conexão e das regras de acesso do Firebase. Para usar outro banco, ajuste `apiUrl` no serviço. O projeto não implementa autenticação nem reservas; a disponibilidade é informada no cadastro.
