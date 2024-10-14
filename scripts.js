// IDs dos seus Google Docs
const docIds = [
    '1mrN48I3k7ybmhR0xxx-05qo-A0yng8RsPZ2d-FiuZ_w',
    '1SZKkyLQ1121qyOS9Z4idEyK3touhw_ts0xLL7GAlaNU',
    '1xAbpqYCx1J7NX982S4gJmCJE2xJBlshmI-CCp1adDUg',
    '1TxTePk4AdPv-P_0qbqERTrKhQjoiupg5J25jJT02mNM',
    '1DvP8JOD-m5DqLuJUa9GSQ70kHE8uxSKjqvQY3ALQ51Q',
    '178dkk-LVAegOWRj2c7XX-lAO973KENo4RstAb9uyrZU',
    '1VbMYGP7F8B-4V0w90NcLcaSWMR-YGuJVv2hgwesjOeU',
    '1Mny_mvylOR81W5-xLUgqmHkd54YGI3nBTc6638LqEWo',
    '11OrsN8cJ936B0KXfQBdKkzuh1i_xUZ81LnyH95KrclY',
    '1EwWBUGUUk9GT_mfz6WteykTcbrkt7JWt508xrEc2Q-c',
    '1-agPCQV4Pm6QXms93niuzHJz8HfVLKyowchPX4ItzhA',
    '1WEHM1OMXCaceJqp9fHVPScLm3RIU7D6XpPtSS4YePNo',
    '138u3_aaUi7w0sPeVyQ_0C2HG1c-fKTOM3DWE-fhG15I'
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
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';  // Limpa a lista antes de recarregar

    docIds.forEach(docId => {
        const url = `https://docs.googleapis.com/v1/documents/${docId}`;

        gapi.client.request({
            path: url
        }).then(response => {
            const content = response.result.body.content;

            // Iterar sobre o conteúdo do Google Docs
            content.forEach(element => {
                if (element.paragraph && element.paragraph.elements) {
                    element.paragraph.elements.forEach(el => {
                        if (el.textRun) {
                            const text = el.textRun.content.trim();

                            // Verificar se o texto contém o formato específico "Nome do arquivo - tamanho: link"
                            const linkPattern = /(.+?) - tamanho: (http[s]?:\/\/[^\s]+)/;
                            const match = text.match(linkPattern);

                            if (match) {
                                const fileName = match[1];  // Nome do arquivo
                                const fileLink = match[2];  // Link

                                const li = document.createElement('li');
                                const a = document.createElement('a');
                                a.href = fileLink;
                                a.textContent = fileName;  // Exibir o nome do arquivo e ocultar o link
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

    // Log para depuração
    console.log("Filtro aplicado:", searchInput);

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
