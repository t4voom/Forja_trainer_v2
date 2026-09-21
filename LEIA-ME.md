# FORJA Trainer

Site das academias e treinadores. É separado do app dos alunos: publique esta pasta num endereço próprio (ex.: `trainer.seudominio.com`) e envie o link só para as academias.

Ele usa o **mesmo Apps Script e a mesma planilha** do app FORJA. Não existe outro banco de dados.

## Estrutura

```
Forja_trainer/
├── index.html            página única (rotas por #/…)
├── assets/icon.svg       logo e favicon
├── css/trainer.css       visual (tema escuro e claro)
└── js/
    ├── config.js         URL do Apps Script  ← confira antes de publicar
    ├── api.js            chamadas trainer* ao Apps Script
    ├── ui.js             toast, modal, gráficos, tabela, formatação
    ├── views.js          Dashboard, Alunos, Perfil do aluno, Treinos, Academia, Treinadores
    ├── editor.js         editor de treino
    ├── app.js            login, menu, rotas, configurações
    └── shared/           copiados do app FORJA
        ├── utils.js      ícones e formatação
        ├── exercises.js  biblioteca de exercícios (mesmos IDs do app)
        └── store.js      "Store" mínimo que a biblioteca precisa
```

## Publicar

1. Em `js/config.js`, confira se `sheetsUrl` é a mesma URL `/exec` do app.
2. Envie a pasta inteira para a hospedagem (Netlify, Vercel, GitHub Pages, Hostinger…). É um site estático: não precisa de servidor nem de build.
3. Ao publicar uma atualização, troque o `?v=1` do `index.html` por `?v=2`, `?v=3`… para os navegadores baixarem os arquivos novos.

## Acesso

- Só entra quem tem login de treinador, criado pelo menu **FORJA Admin › Criar treinador** na planilha.
- No primeiro acesso, o treinador troca a senha provisória.
- Toda chamada é validada no Apps Script: sessão de treinador, treinador ativo, acesso à academia, academia ativa, permissão e aluno com vínculo ativo. Conhecer o endereço do site não dá acesso a nada.
- O `robots` está como `noindex`, para o site não aparecer no Google.

## Manter em dia com o app

`js/shared/utils.js` e `js/shared/exercises.js` são cópias dos arquivos do app. Se você adicionar exercícios na biblioteca do app (`js/exercises.js`), copie o arquivo para cá também. Assim os nomes aparecem iguais nos dois lugares.
