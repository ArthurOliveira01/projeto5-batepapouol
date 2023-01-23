let nome = "";
let content = document.querySelector('.content');

function entradaSala(){
    while(nome === ""){ 
        nome = prompt('Digite o seu nome');
    }
}

function searchMessage(){
    const aux = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    aux.then(process);
    aux.catch(errorProcess);
}

function process(r){
    const arrayMensagens = r.data;
    console.log(arrayMensagens);
    
    for (let i = 0; i < arrayMensagens.length; i++){
        if (arrayMensagens[i].type === "status"){
            conteudoChat.innerHTML += `
            <div data-test="message" class="status">
                <span>(${arrayMensagens[i].time}) <span class="negrito">${arrayMensagens[i].from}</span> ${arrayMensagens[i].text}</span>
            </div>
            `;

        } if (arrayMensagens[i].type === "message"){
            conteudoChat.innerHTML += `
            <div data-test="message" class="normais">
                <span>(${arrayMensagens[i].time}) <span class="negrito">${arrayMensagens[i].from}</span> para <span class="negrito">${arrayMensagens[i].to}</span>: ${arrayMensagens[i].text}</span>
            </div>
            `;

        } if (arrayMensagens[i].type === "private_message"){
            if (nome === arrayMensagens[i].to || nome === arrayMensagens[i].from){
                conteudoChat.innerHTML += `
                <div data-test="message" class="reservadas">
                    <span>(${arrayMensagens[i].time}) <span class="negrito">${arrayMensagens[i].from}</span> reservadamente para <span class="negrito">${arrayMensagens[i].to}</span>: ${arrayMensagens[i].text}</span>
                </div>
                `;
            }
        
        } if (arrayMensagens[i] === arrayMensagens[arrayMensagens.length - 1]){
            conteudoChat.innerHTML += `
            <span class="ultima" ></span>
            `;
            const aparecerUltimaMensagem = document.querySelector('.ultima');
            aparecerUltimaMensagem.scrollIntoView();
        }
        
    }
}
function errorProcess(r){
    console.log(r);
}

function nameOk(){
    searchMessage();
    getUsuarios();
    updateUsuarios();
}

function nameOff(){

}

function checkNome(n){
    const data = {
        name: `${n}`
    };;
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', data);
    requisicao.then(nameOk);
    requisicao.catch(nameOff);
}

function updateMessages(){
    if(content.innerHTML !== ''){
        content.innerHTML = '';
        searchMessage();
    }
}

function success(){
    updateMessages();
}

function notSend(){
    window.location.reload();
}

function sendMessage(){
    let mensagem = document.querySelector('.write').value;
    if (mensagem === ""){
        return;
    }
    const data = {
        from: nome,
        to: "Todos",
        text: mensagem,
        type: "message"
    }
    document.querySelector('.write').value = '';
    const aux = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages');
    aux.then(success);
    aux.catch(notSend);
}
entradaSala();