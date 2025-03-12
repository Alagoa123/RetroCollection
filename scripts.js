document.getElementById('login-btn').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    if (!email) {
        alert('Por favor, insira seu e-mail.');
        return;
    }

    // Simulação de verificação de e-mail
    if (checkEmailInDocument(email)) {
        alert('Acesso liberado!');
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
    } else {
        alert('E-mail não encontrado no documento.');
    }
});

document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const tab = this.getAttribute('data-tab');
        document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
        document.getElementById(`${tab}-tab`).style.display = 'block';
    });
});

document.getElementById('browse-btn').addEventListener('click', function() {
    // Simulação de seleção de diretório
    const directory = prompt('Selecione o diretório de download:');
    if (directory) {
        document.getElementById('directory').value = directory;
    }
});

document.getElementById('download-btn').addEventListener('click', function() {
    const url = document.getElementById('url').value;
    const directory = document.getElementById('directory').value;
    const format = document.querySelector('input[name="format"]:checked').value;

    if (!url || !directory) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    alert(`Iniciando download da playlist ${url} no formato ${format} para o diretório ${directory}`);
    // Aqui você pode adicionar a lógica de download
});

document.getElementById('select-mp3-btn').addEventListener('click', function() {
    alert('Selecione os arquivos MP3 para adicionar capas.');
    // Aqui você pode adicionar a lógica para adicionar capas
});

function checkEmailInDocument(email) {
    // Simulação de verificação de e-mail
    const validEmails = ['user1@example.com', 'user2@example.com'];
    return validEmails.includes(email);
}
