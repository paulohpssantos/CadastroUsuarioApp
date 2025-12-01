# CadastroUsuarioApp

## Descrição do projeto

CadastroUsuarioApp é um aplicativo de exemplo (mobile/web) para cadastro e gerenciamento de usuários e seus endereços. O projeto usa Expo e React Native para a interface e inclui serviços locais para CRUD de usuários e endereços, além de hooks React para encapsular a lógica de negócio (por exemplo, `use-usuario`).

## Tecnologias utilizadas

- Expo (54)
- React 19.1.0
- React Native 0.81.5
- TypeScript
- Drizzle ORM (para manipulação de dados locais/SQLite)
- Axios (requisições HTTP)
- react-native-paper (componentes UI)
- @react-navigation (navegação)
- react-native-reanimated, gesture-handler, safe-area-context
- Bibliotecas de teste: Jest, @testing-library/react-native, react-test-renderer


## Instruções de instalação

1. Clone o repositório:

```bash
git clone <repo-url>
cd CadastroUsuarioApp
```

2. Instale dependências (recomendo Node.js LTS e npm v8+/v9+):

```bash
npm install
```

## Instruções de execução

- Rodar em desenvolvimento (Expo):

```bash
npm start
```

- Rodar no emulador iOS/Android (requer ambiente configurado):

```bash
npm run ios
npm run android
```

- Rodar no web (Expo web):

```bash
npm run web
```

- Rodar a suíte de testes com Jest:

```bash
npm test
```

Se quiser rodar apenas um arquivo de teste especifico:

```bash
npx jest path/to/test -i
```

## Decisões técnicas tomadas

- Expo + React Native: facilidade de setup multiplataforma, hot-reload e integração com ferramentas mobile/web.
- Drizzle ORM: escolhida para organizar acessos a banco local (SQLite no qual já conheço bem a arquitetura) com tipos e migrations mais fáceis.
- Arquitetura: separar serviços (`src/services/*`) para a camada de persistência/integração e hooks (`hooks/use-usuario.ts`) para lógica reaproveitável na UI.
- Testes: usar `@testing-library/react-native` e Jest para testes de componentes e hooks com mocks dos serviços.

## Dificuldades encontradas

- Dependências de teste: houve conflito de versões entre `react-test-renderer` e `@testing-library/react-native` que exigiu alinhar versões no `package.json`  para manter compatibilidade com React 19.1.0.


## Melhorias futuras

- Adicionar testes unitários e de integração mais abrangentes (mocks para serviços, testes de hooks com helpers como `renderHook`).
- Configurar CI (GitHub Actions) para rodar lint, build e testes automaticamente.
- Implementar validação de formulários (ex.: usando `zod` ou `yup`) e feedback de erros na UI.
- Adicionar scripts de migração/versionamento para o schema SQLite e backups.


## Estrutura do projeto

- `app/` e `CadastroUsuarioApp/app/`: ponto de entrada com rotas (expo-router) e telas.
- `src/models/`: interfaces `Usuario` e `Endereco`.
- `src/services/`: funções que manipulam dados (usuário, endereço, viaCep).
- `hooks/`: hooks reutilizáveis (ex.: `use-usuario`).
- `components/`, `constants/`, `utils/`: UI, estilos e utilitários.

---

## Contato

- Autor: [@paulohpssantos](https://github.com/paulohpssantos)
- Email: paulo.henriquepsantos@gmail.com