// IDs dos seus Google Docs
const docIds = [
    'GOOGLE_DOCS_ID_1',  // Substitua com o ID do primeiro Google Docs
    'GOOGLE_DOCS_ID_2',  // Substitua com o ID do segundo Google Docs
    'GOOGLE_DOCS_ID_3'   // Substitua com o ID do terceiro Google Docs
];

// Suas credenciais do Google OAuth
const clientId = '784791686081-p9edlshrli77jgevg1fpk7e05l7db9k0.apps.googleusercontent.com';
const apiKey = ''; // Deixe em branco por enquanto
const scopes = 'https://www.googleapis.com/auth/documents.readonly';
let tokenClient;
let gapiInited = false;
let gisInited = false;

// Função para inicializar a API do Google Docs
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

// Inicializar o cliente da API
function initializeGapiClient() {
    gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: ['https://docs.googleapis.com/$discovery/rest?version=v1'],
    }).then(() => {
        gapiInited = true;
        maybeEnableButtons();
    });
}

// Carregar a API
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: scopes,
        callback: '', // Chamada de retorno será definida na ação do login
    });
    gisInited = true;
    maybeEnableButtons();
}

// Ativar o botão de login quando a API estiver carregada
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('login-button').style.visibility = 'visible';
    }
}

// Função de login para iniciar a autenticação
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        loadLinksFromDocs(); // Carregar links após a autenticação
    };

    if (gapi.client.getToken() === null) {
        // Solicitar um token de acesso se não houver um
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        // Caso contrário, usar o token existente
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

// Função para carregar links de múltiplos documentos
function loadLinksFromDocs() {
    docIds.forEach(docId => {
        const url = `https://docs.googleapis.com/v1/documents/${docId}`;

        gapi.client.request({
            path: url
        }).then(response => {
            const content = response.result.body.content;
            const fileList = document.getElementById('fileList');

            // Iterar sobre o conteúdo do Google Docs
            content.forEach(element => {
                if (element.paragraph && element.paragraph.elements) {
                    element.paragraph.elements.forEach(el => {
                        if (el.textRun && el.textRun.content.includes('http')) {
                            const linkText = el.textRun.content.trim();
                            const urlMatch = linkText.match(/\bhttps?:\/\/\S+/gi);

                            if (urlMatch) {
                                const li = document.createElement('li');
                                const a = document.createElement('a');
                                a.href = urlMatch[0];
                                a.textContent = linkText;
                                li.appendChild(a);
                                fileList.appendChild(li);
                            }
                        }
                    });
                }
            });
        });
    });
}

// Função para filtrar os links com base no texto digitado
function filterLinks() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const links = document.getElementById('fileList').getElementsByTagName('li');

    for (let i = 0; i < links.length; i++) {
        const link = links[i].getElementsByTagName('a')[0];
        const textValue = link.textContent || link.innerText;

        if (textValue.toLowerCase().indexOf(searchInput) > -1) {
            links[i].style.display = "";
        } else {
            links[i].style.display = "none";
        }
    }
}

// Carregar a biblioteca de API do Google Docs
window.onload = function () {
    gapiLoaded();
    gisLoaded();
}
