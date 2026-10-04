# CineTrack — Catálogo pessoal de filmes

## Identificação

**Nome:** Yasmin Conceição de Lima Carvalho  
**Disciplina:** Desenvolvimento Web  
**Professor:** Ivan Luiz Pedroso Pires  
**Tema:** Catálogo interativo de filmes  

---

## Sobre o projeto

Essa é a versão 2.0 do primeiro site desenvolvido em 2025 em Introdução ao Desenvolvimento Web.

O **CineTrack** é um catálogo pessoal de filmes criado a partir de uma seleção feita por mim. A proposta é apresentar filmes que já assisti, reunindo informações como título, categoria, ano, país, gêneros, sinopse, trailer e uma nota pessoal. A seleção deste catálogo é apenas uma pequena parcela contendo 40 filmes, de uma lista pessoal. A ideia inicial é começar com um pequeno catálogo e ir ampliando.

A interface foi desenvolvida com uma identidade visual inspirada em cinema, utilizando os pôsteres, destaque para notas e uma área de detalhes para cada filme.

As notas são opiniões pessoais e não representam crítica profissional ou avaliação técnica.

O projeto utiliza **HTML5, CSS3, JavaScript, Bootstrap 5 e Fetch API**, sem frameworks como React, Vue ou Angular.

E utilizado IA para reorganizar e reestruturar textos presentes no site e no GitHub, assim como utilizado para melhorar a escolha visual atual e analisar algumas estruturas de acordo com as solicitações para a Avaliação 1 de Desenvolvimento Web. 

---

## Funcionalidades

- Catálogo com 40 filmes carregados dinamicamente por AJAX.
- Listagem construída a partir dos dados recebidos por JSON.
- Busca por título, categoria, ano, país, gênero ou palavra da sinopse.
- Filtro por categoria.
- Contador atualizado conforme os resultados da busca/filtro.
- Cards responsivos com pôster, nota, categoria, gêneros e resumo.
- Modal Bootstrap para os detalhes do filme.
- Nova requisição AJAX para buscar os detalhes do item selecionado.
- Exibição de trailer dentro do modal.
- Exibição de gêneros, ano, país, categoria, sinopse e nota pessoal.
- Indicador de carregamento.
- Estado para nenhum resultado.
- Estado de erro na requisição.
- Botão de tentativa novamente em caso de falha.
- Accordion Bootstrap na seção de informações do projeto.
- Navbar responsiva do Bootstrap.
- Layout responsivo para celular, tablet e computador.
- HTML semântico e atributos de acessibilidade básicos.

---

## Tecnologias

- **HTML5** — estrutura e semântica.
- **CSS3** — identidade visual e responsividade complementar.
- **JavaScript** — interação, filtros, renderização e requisições AJAX.
- **Fetch API** — requisições HTTP dos arquivos JSON.
- **Bootstrap 5.3.3** — navbar, grid, cards, botões, formulário, modal e accordion.
- **Bootstrap Icons 1.11.3** — ícones da interface.
- **JSON** — fonte dos dados da listagem e dos detalhes.

---

## Estrutura do projeto

```text
CineTrack_Avaliacao_Entrega/
│
├── index.html
├── README.md
├── GITHUB_GUIA.md
├── .gitignore
│
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
├── data/
│   ├── lista-filmes.json
│   └── detalhes-filmes.json
│
└── assets/
    └── imagens/
        ├── 1.jpg
        ├── 2.jpg
        └── ...
```

### Organização dos dados

- `lista-filmes.json`: dados utilizados para montar o catálogo inicial.
- `detalhes-filmes.json`: fonte separada utilizada pela segunda requisição AJAX para preencher os detalhes do filme.

Essa separação permite demonstrar claramente a diferença entre a requisição de listagem e a requisição de detalhes exigida na atividade.

---

## Como executar no VS Code

O projeto **não deve ser aberto diretamente com `file://`**, pois os arquivos JSON são carregados por `fetch()` através de requisições HTTP.

### Opção 1 — Live Server

1. Extraia o ZIP.
2. Abra a pasta `CineTrack-2.0` no VS Code.
3. Instale a extensão **Live Server**, caso ainda não tenha.
4. Clique com o botão direito em `index.html`.
5. Selecione **Open with Live Server**.
6. O navegador abrirá o projeto em um endereço HTTP local.

### Opção 2 — Python

No terminal, dentro da pasta do projeto:

```bash
python -m http.server 5500
```

Depois acesse:

```text
http://localhost:5500
```

---

## Roteiro para testar a atividade

### 1. Testar a listagem AJAX

1. Inicie o projeto por HTTP.
2. Abra a página.
3. Aguarde o indicador de carregamento.
4. Os filmes devem aparecer automaticamente no catálogo.

A fonte utilizada é:

```text
data/lista-filmes.json
```

O arquivo é obtido com `fetch()` e os cards são criados dinamicamente com JavaScript.

### 2. Testar a consulta de detalhes AJAX

1. Vá até o catálogo.
2. Clique em **Ver detalhes** em qualquer filme.
3. O modal do Bootstrap deve abrir.
4. Durante a consulta aparece o estado **Buscando detalhes do filme...**.
5. Após a resposta, o modal mostra as informações adicionais e o trailer.

A segunda fonte utilizada é:

```text
data/detalhes-filmes.json
```

Os detalhes não são simplesmente revelados a partir do HTML: eles são buscados em uma nova requisição após a seleção do filme.

### 3. Testar a busca

No campo de busca, experimente:

```text
barbie
```

Também é possível pesquisar por ano, país, categoria, gênero ou palavras presentes na sinopse.

Os resultados são atualizados sem recarregar a página.

### 4. Testar o filtro

No campo **Filtrar por categoria**, selecione uma categoria.

Os cards devem ser atualizados sem recarregar a página e o contador deve mostrar a quantidade encontrada.

### 5. Testar o estado vazio

Digite algo que não exista, por exemplo:

```text
filme inexistente xyz
```

A interface deve apresentar:

**Nenhum filme encontrado.**

Depois, clique em **Limpar filtros**.

### 6. Testar o estado de erro da listagem

O projeto possui um modo de teste para demonstrar o tratamento de falha da requisição.

Com o servidor funcionando, abra no navegador:

```text
http://localhost:5500/?teste=erro-lista
```

A interface deverá mostrar a mensagem de erro e o botão **Tentar novamente**.

Para voltar ao funcionamento normal, abra:

```text
http://localhost:5500/
```

### 7. Testar o estado de erro dos detalhes

Abra:

```text
http://localhost:5500/?teste=erro-detalhes
```

Depois clique em **Ver detalhes** em um filme.

O modal deverá apresentar o estado de erro e o botão **Tentar novamente**.

Para voltar ao funcionamento normal, remova `?teste=erro-detalhes` da URL.

> Os modos de teste existem apenas para demonstrar ao professor os estados de erro exigidos na avaliação. A execução normal não utiliza esses caminhos inválidos.

### 8. Testar a responsividade

Utilize o modo de dispositivos do navegador ou redimensione a janela.

Verifique principalmente:

- menu de navegação;
- apresentação inicial;
- formulário de busca e filtro;
- quantidade de cards por linha;
- botões;
- modal;
- trailer;
- ausência de rolagem horizontal indevida.

---

## Acessibilidade e semântica

O projeto utiliza:

- `header`, `nav`, `main` e `footer`;
- `section`, `article` e `aside` quando adequados;
- títulos hierárquicos;
- `label` associado aos campos de formulário;
- textos alternativos nas imagens informativas;
- `aria-label`, `aria-live` e `role` nos principais estados da interface;
- link para pular diretamente ao conteúdo;
- suporte a `prefers-reduced-motion` para reduzir animações quando essa preferência estiver ativa.

---

## Fontes e recursos utilizados

### Dados

Os dados dos filmes foram organizados a partir da seleção e das informações utilizadas no projeto original do CineTrack. Os arquivos JSON são locais e servem como fonte de dados para as requisições HTTP exigidas na atividade.

### Imagens

As imagens dos pôsteres são as imagens utilizadas na seleção original do CineTrack e estão armazenadas localmente em `assets/imagens`.

### Trailers

Os trailers são incorporados do YouTube por meio de `iframe`.

### Bibliotecas

- Bootstrap 5.3.3 — https://getbootstrap.com/
- Bootstrap Icons 1.11.3 — https://icons.getbootstrap.com/
- Google Fonts — https://fonts.google.com/

---

## Limites e escolhas técnicas

No projeto inicial também não havia a parte de backend, banco de dados, autenticação ou framework de frontend. Sendo apenas para a representação do catálogo

Não foi utilizado backend, banco de dados, autenticação ou framework de frontend, pois esses recursos não são necessários para a proposta da avaliação.

Os dados locais em JSON são suficientes para demonstrar as requisições HTTP, a construção dinâmica da interface e a consulta separada dos detalhes.

---

## Autoria

Projeto acadêmico individual desenvolvido por **Yasmin Conceição de Lima Carvalho** para a disciplina de **Desenvolvimento Web**.
