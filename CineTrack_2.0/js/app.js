/*
 * CineTrack - Desenvolvimento Web
 *
 * Organização do script:
 * 1. Estado e elementos do DOM
 * 2. Inicialização
 * 3. Requisições AJAX (Fetch API)
 * 4. Listagem e renderização
 * 5. Busca e filtro
 * 6. Consulta AJAX de detalhes
 * 7. Estados da interface
 * 8. Funções auxiliares
 *
 * Os comentários foram mantidos simples para facilitar a explicação do código
 * durante a apresentação acadêmica.
 */

const CONFIG = {
  listaUrl: 'data/lista-filmes.json',
  detalhesUrl: 'data/detalhes-filmes.json'
};

const state = {
  filmes: [],
  filtrados: [],
  filmeAtualId: null,
  modal: null
};

const $ = (seletor) => document.querySelector(seletor);

const elementos = {
  grid: $('#catalogo-grid'),
  loading: $('#estado-carregamento'),
  erro: $('#estado-erro'),
  vazio: $('#estado-vazio'),
  busca: $('#campo-busca'),
  categoria: $('#filtro-categoria'),
  limparBusca: $('#limpar-busca'),
  limparFiltros: $('#limpar-filtros'),
  limparVazio: $('#limpar-vazio'),
  tentarNovamente: $('#tentar-novamente'),
  contador: $('#contador-resultados'),
  totalFilmes: $('#total-filmes'),
  totalGeneros: $('#total-generos'),
  maiorNota: $('#maior-nota'),
  heroPoster: $('#hero-poster'),
  heroTitle: $('#hero-title'),
  heroRating: $('#hero-rating'),
  modalLoading: $('#modal-loading'),
  modalError: $('#modal-error'),
  modalData: $('#modal-content-data'),
  modalTitulo: $('#modalTitulo'),
  modalImagem: $('#modal-imagem'),
  modalDescricao: $('#modalDescricao'),
  modalNota: $('#modalNota'),
  modalEstrelas: $('#modalEstrelas'),
  modalAno: $('#modalAno'),
  modalPais: $('#modalPais'),
  modalCategoria: $('#modalCategoria'),
  modalGeneros: $('#modal-generos'),
  modalTrailer: $('#modalTrailer'),
  tentarDetalhes: $('#tentar-detalhes')
};

// Permite testar os estados de erro sem alterar o projeto definitivamente.
// Exemplos: ?teste=erro-lista ou ?teste=erro-detalhes
const parametros = new URLSearchParams(window.location.search);
const modoTeste = parametros.get('teste');

// Inicialização da aplicação.
document.addEventListener('DOMContentLoaded', () => {
  state.modal = new bootstrap.Modal($('#filmeModal'));

  elementos.busca.addEventListener('input', aplicarFiltros);
  elementos.categoria.addEventListener('change', aplicarFiltros);
  elementos.limparBusca.addEventListener('click', () => {
    elementos.busca.value = '';
    aplicarFiltros();
    elementos.busca.focus();
  });
  elementos.limparFiltros.addEventListener('click', limparFiltros);
  elementos.limparVazio.addEventListener('click', limparFiltros);
  elementos.tentarNovamente.addEventListener('click', carregarCatalogo);
  elementos.tentarDetalhes.addEventListener('click', () => {
    if (state.filmeAtualId) abrirDetalhes(state.filmeAtualId);
  });
  $('#filmeModal').addEventListener('hidden.bs.modal', limparModal);

  carregarCatalogo();
});

/**
 * Realiza uma requisição HTTP e transforma a resposta em JSON.
 * Esta função é usada tanto para a listagem quanto para os detalhes.
 */
async function buscarJSON(caminho) {
  const resposta = await fetch(`${caminho}?v=2&t=${Date.now()}`);

  if (!resposta.ok) {
    throw new Error(`Falha HTTP ${resposta.status}`);
  }

  return resposta.json();
}

/** Carrega a lista principal por AJAX. */
async function carregarCatalogo() {
  mostrarEstado('loading');
  elementos.contador.textContent = 'Carregando...';

  try {
    const caminho = modoTeste === 'erro-lista' ? 'data/arquivo-inexistente.json' : CONFIG.listaUrl;
    const dados = await buscarJSON(caminho);

    if (!Array.isArray(dados)) {
      throw new Error('Formato de dados inválido.');
    }

    state.filmes = dados;
    preencherCategorias();
    atualizarResumo();
    aplicarFiltros();
  } catch (erro) {
    console.error('Erro ao carregar o catálogo:', erro);
    state.filmes = [];
    state.filtrados = [];
    mostrarEstado('erro');
    elementos.contador.textContent = 'Não disponível';
  }
}

/** Cria as opções do filtro a partir dos dados recebidos. */
function preencherCategorias() {
  const categorias = [...new Set(
    state.filmes
      .map((filme) => filme.category)
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, 'pt-BR'));

  elementos.categoria.innerHTML = '<option value="">Todas as categorias</option>';
  categorias.forEach((categoria) => {
    const option = document.createElement('option');
    option.value = categoria;
    option.textContent = categoria;
    elementos.categoria.appendChild(option);
  });
}

/** Atualiza as informações de destaque do topo usando os dados do JSON. */
function atualizarResumo() {
  const categorias = new Set(
    state.filmes.map((filme) => filme.category).filter(Boolean)
  );
  const maior = Math.max(...state.filmes.map((filme) => Number(filme.rating) || 0));
  const destaque = state.filmes.find((filme) => Number(filme.rating) === maior) || state.filmes[0];

  elementos.totalFilmes.textContent = state.filmes.length;
  elementos.totalGeneros.textContent = categorias.size;
  elementos.maiorNota.textContent = `${maior}/10`;

  if (destaque) {
    elementos.heroPoster.src = destaque.image;
    elementos.heroPoster.alt = `Pôster de ${destaque.title}`;
    elementos.heroTitle.textContent = destaque.title;
    elementos.heroRating.textContent = destaque.rating;
  }
}

/** Filtra os dados já carregados, sem recarregar a página. */
function aplicarFiltros() {
  const termo = elementos.busca.value.trim().toLocaleLowerCase('pt-BR');
  const categoria = elementos.categoria.value;

  state.filtrados = state.filmes.filter((filme) => {
    // O texto pesquisável inclui título, categoria, ano, país, gêneros e resumo.
    const texto = [
      filme.title,
      filme.category,
      filme.year,
      filme.country,
      ...(Array.isArray(filme.genres) ? filme.genres : []),
      filme.summary
    ].join(' ').toLocaleLowerCase('pt-BR');

    const correspondeBusca = !termo || texto.includes(termo);
    const correspondeCategoria = !categoria || filme.category === categoria;

    return correspondeBusca && correspondeCategoria;
  });

  renderizarCatalogo();
}

/** Constrói os cards dinamicamente com os dados recebidos. */
function renderizarCatalogo() {
  elementos.grid.innerHTML = '';

  const quantidade = state.filtrados.length;
  elementos.contador.textContent = `${quantidade} ${quantidade === 1 ? 'filme encontrado' : 'filmes encontrados'}`;

  if (!quantidade) {
    mostrarEstado('vazio');
    return;
  }

  mostrarEstado('catalogo');
  const fragmento = document.createDocumentFragment();

  state.filtrados.forEach((filme) => {
    fragmento.appendChild(criarCard(filme));
  });

  elementos.grid.appendChild(fragmento);
}

/** Cria um card Bootstrap/semântico para cada filme. */
function criarCard(filme) {
  const coluna = document.createElement('div');
  coluna.className = 'col';

  const card = document.createElement('article');
  card.className = 'movie-card';

  const generos = Array.isArray(filme.genres) ? filme.genres.slice(0, 2) : [];
  const badges = generos.length
    ? generos.map((genero) => `<span class="badge movie-badge">${escaparHTML(genero)}</span>`).join('')
    : `<span class="badge movie-badge">${escaparHTML(filme.category || 'Outros')}</span>`;

  card.innerHTML = `
    <div class="poster-wrap">
      <img src="${escaparAtributo(filme.image)}" alt="Pôster do filme ${escaparAtributo(filme.title)}" loading="lazy">
      <div class="poster-overlay"></div>
      <span class="movie-rating"><i class="bi bi-star-fill me-1" aria-hidden="true"></i>${escaparHTML(String(filme.rating))}/10</span>
      <span class="movie-category">${escaparHTML(filme.category || 'Outros')}</span>
    </div>
    <div class="movie-body">
      <div class="movie-badges" aria-label="Gêneros do filme">${badges}</div>
      <h3 class="movie-title">${escaparHTML(filme.title)}</h3>
      <div class="movie-meta"><i class="bi bi-calendar3 me-1" aria-hidden="true"></i>${escaparHTML(filme.year)}${filme.country ? ` <span class="dot-separator">•</span> ${escaparHTML(filme.country)}` : ''}</div>
      <p class="movie-summary">${escaparHTML(filme.summary)}</p>
      <button class="btn details-btn details-btn-action" type="button" data-filme-id="${escaparAtributo(filme.id)}">
        <i class="bi bi-eye me-1" aria-hidden="true"></i>Ver detalhes
      </button>
    </div>`;

  card.querySelector('.details-btn-action').addEventListener('click', () => abrirDetalhes(filme.id));
  coluna.appendChild(card);

  return coluna;
}

/**
 * Busca os detalhes em uma NOVA requisição AJAX.
 * A listagem não contém todos os dados exibidos no modal.
 */
async function abrirDetalhes(id) {
  state.filmeAtualId = id;
  prepararModalCarregando();
  state.modal.show();

  try {
    const caminho = modoTeste === 'erro-detalhes' ? 'data/arquivo-inexistente.json' : CONFIG.detalhesUrl;
    const dados = await buscarJSON(caminho);
    const filme = Array.isArray(dados)
      ? dados.find((item) => Number(item.id) === Number(id))
      : null;

    if (!filme) {
      throw new Error('Filme não encontrado.');
    }

    preencherModal(filme);
  } catch (erro) {
    console.error('Erro ao carregar detalhes:', erro);
    elementos.modalLoading.classList.add('d-none');
    elementos.modalData.classList.add('d-none');
    elementos.modalError.classList.remove('d-none');
  }
}

/** Mostra o estado de carregamento do modal. */
function prepararModalCarregando() {
  elementos.modalLoading.classList.remove('d-none');
  elementos.modalError.classList.add('d-none');
  elementos.modalData.classList.add('d-none');
}

/** Preenche o modal somente depois que os detalhes chegam por AJAX. */
function preencherModal(filme) {
  elementos.modalLoading.classList.add('d-none');
  elementos.modalError.classList.add('d-none');
  elementos.modalData.classList.remove('d-none');

  elementos.modalTitulo.textContent = filme.title;
  elementos.modalImagem.src = filme.image;
  elementos.modalImagem.alt = `Imagem do filme ${filme.title}`;
  elementos.modalDescricao.textContent = filme.summary;
  elementos.modalNota.textContent = filme.rating;
  elementos.modalAno.textContent = filme.year;
  elementos.modalPais.textContent = filme.country || 'Não informado';
  elementos.modalCategoria.textContent = filme.category || 'Não informada';
  elementos.modalGeneros.innerHTML = (filme.genres || [])
    .map((genero) => `<span class="modal__genre">${escaparHTML(genero)}</span>`)
    .join('');
  elementos.modalEstrelas.innerHTML = estrelas(filme.rating);
  elementos.modalEstrelas.setAttribute('aria-label', `Nota pessoal: ${filme.rating} de 10`);
  elementos.modalTrailer.src = filme.trailer ? normalizarYoutube(filme.trailer) : '';
}

function limparModal() {
  elementos.modalTrailer.src = '';
  state.filmeAtualId = null;
  prepararModalCarregando();
}

function normalizarYoutube(url) {
  try {
    const youtube = new URL(url);
    youtube.searchParams.set('rel', '0');
    return youtube.toString();
  } catch {
    return url;
  }
}

function estrelas(nota) {
  const valor = Math.round(Number(nota));
  return Array.from({ length: 10 }, (_, indice) => (
    `<i class="bi ${indice < valor ? 'bi-star-fill' : 'bi-star'} me-1" aria-hidden="true"></i>`
  )).join('');
}

function limparFiltros() {
  elementos.busca.value = '';
  elementos.categoria.value = '';
  aplicarFiltros();
}

/** Controla os estados principais da página. */
function mostrarEstado(tipo) {
  elementos.loading.classList.toggle('d-none', tipo !== 'loading');
  elementos.erro.classList.toggle('d-none', tipo !== 'erro');
  elementos.vazio.classList.toggle('d-none', tipo !== 'vazio');
  elementos.grid.classList.toggle('d-none', tipo !== 'catalogo');
}

/** Evita inserir texto vindo dos JSON como HTML não confiável. */
function escaparHTML(valor) {
  return String(valor ?? '').replace(/[&<>'"]/g, (caractere) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[caractere]));
}

function escaparAtributo(valor) {
  return escaparHTML(valor);
}
