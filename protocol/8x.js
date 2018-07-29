var chalk   = require('chalk');
const msgconfig = require('../config/msg.json');






exports.codificaMensagem = function(option) {
	var retorno;

	 //console.log('Aqui chegou');

    switch(option.operacao) {

        case 'Solicita Assinatura':
            retorno = '01+RC+00+MODELO';
        break;

    	case 'Ação autorizada':
            console.log('Permissão: '+chalk.bold.green('Autorizado'));

            var codigoEvento;
            var tempoAcionamento = 2; // 2

            if(option.master)
                codigoEvento = 3; // Liberado por master;
            else {
                // nao ta vindo sentido ainda Saída ou Entrada
                codigoEvento = 5; // 6 = Libera saida // 5 = Liberada entrada // 1 = Somente liberado (em caso de catraca pros 2 lados)
            }
            //console.log('RECEBER SOLICITACAO')
            retorno = '00+REON+00+'+codigoEvento+']'+tempoAcionamento+']' + option.mensagem_linha1 + '}' + option.mensagem_linha2 + ']';
        break;

        case 'Ação negada':
            console.log('Permissão: '+chalk.bold.red('Não Autorizado'));

            // somente o comando 37 aciona relê
            var codigoEvento = 37; // 30 = Negado
            var tempoAcionamento = 6; // 2
            var rele = 2;//option.rele || '';

            //retorno = '00+REON+00+'+codigoEvento+']'+tempoAcionamento+']' + option.mensagem_linha1 + '}' + option.mensagem_linha2 + ']'+rele;
            
            retorno = '00+REON+00+'+codigoEvento+']'+tempoAcionamento+']' + option.mensagem_linha1 + '}' + option.mensagem_linha2 + ']';
            

            // console.log(retorno);
        break;

        case 'Configuração inicial':
            var data_hora = getDate();
            retorno = '01+EC+00+';
            retorno += 'MSG_LINHA1' +msgconfig.primeira;
            retorno += 'MSG_LINHA2' +msgconfig.segunda;
			retorno += 'TIPO_VALIDA[O]'; // O = On

            console.log(retorno)

            return gerarProtocolo(retorno);
        break;

        case 'Remove cartões':
            retorno = '01+ECAR+00+20+L]0';
        break;

        case 'Mantem atividade':
  	        var data_hora = getDate();
  	        retorno = '01+EH+00+'+data_hora+']00/00/00]00/00/00';
        break;

        case 'Envia Cartão':
            if(option.cartao) {
                // retorno = '01+ECAR+00+1+A[';
                // retorno += '[{{CODIGO_1}}[{{DATA_FIM}}[{{LIBERADO}}[{{TIPO_CARTAO}}[[[[[BM[[[[[[[{{NOME_CARTAO}}[{{CODIGO_2}}[{{CODIGO_3}}]';

                retorno = '01+ECAR+00+1+A[[{{CODIGO_1}}[[[0[4[0[[[[BM[2[1[1[0[[0';
                retorno = retorno.replace('{{CODIGO_1}}', (option.cartao.codigos[0] ? option.cartao.codigos[0] : '') );

                // 01+ECAR+00+1+A[[17362480[[0[04[[[[[BM[[[[[[[VISITANTE[[]
                // 01+ECAR+00+1+A[[1234567[[0[04[[[[[BM[[[[[[[VISITANTE[[]

                 console.log('' +retorno);
            }
        break;
    }


	return gerarProtocolo(retorno);
}

function getDate() {
  var date = new Date(),
    year = date.getFullYear(),
    month = (date.getMonth() + 1).toString(),
    formatedMonth = (month.length === 1) ? ("0" + month) : month,
    day = date.getDate().toString(),
    formatedDay = (day.length === 1) ? ("0" + day) : day,
    hour = date.getHours().toString(),
    formatedHour = (hour.length === 1) ? ("0" + hour) : hour,
    minute = date.getMinutes().toString(),
    formatedMinute = (minute.length === 1) ? ("0" + minute) : minute,
    second = date.getSeconds().toString(),
    formatedSecond = (second.length === 1) ? ("0" + second) : second;
  return formatedDay + "/" + formatedMonth + "/" + year + " " + formatedHour + ':' + formatedMinute + ':' + formatedSecond;
};


exports.decodificaMensagem = function(options) {
     //console.log('decodificaMensagem');
    mensagem = options.mensagem;
    vMensagem = mensagem.split(']');
    vMensagemAuxiliar = vMensagem[0].split('+'); // tudo antes do primeiro ]

    var retorno = [];
    retorno['status'] = 'erro';

    if(!vMensagemAuxiliar || !vMensagemAuxiliar[1] || !vMensagemAuxiliar[2]) {
        retorno['status'] = 'erro';
        retorno['operacao'] = 'Erro';    
        retorno['observacao'] = 'Fora do protocolo 8x';
    } else {

        operacao = vMensagemAuxiliar[1];
        erro = Number( vMensagemAuxiliar[2].substring(0, 3) );
        codigoEvento = vMensagemAuxiliar[3];
        matricula =  Number(vMensagem[1]); // remove os 0 a esquerda
        matricula = matricula.toString();

        // console.log('operacao :'+operacao);
         console.log('codigoEvento :'+codigoEvento);

        if(erro > 0) {
            retorno['status'] = 'sucesso';
            retorno['operacao'] = 'Erro';

            switch(erro) {
                case 12:
                    retorno['observacao'] = 'Parâmetros informados são inválidos';
                break;
            }
        }

        switch(operacao) {
            case 'RC': // 01+RC+000+MODELO[ACESSO
                var modelo = codigoEvento.replace('MODELO[','').toString().trim();
                // console.log('modelo: ->'+modelo+'<-'); // no final da string modelo existe um digito verificador invisivel, portantando não se pode utilizar comparacoes de igualdade
             
                retorno['status'] = 'sucesso';
                if(modelo.indexOf('ACESSO') !== -1) { // mudar para BRASOL
                    retorno['operacao'] = 'Assinatura confirmada';
                } else {
                    retorno['operacao'] = 'Assinatura não confirmada';
                }
                console.log('retorno[\'operacao\']' +retorno['operacao']);
            break;
            case 'EH': // 01+EH+000
                // Resposta do Mantem atividade ao atualizar Data e Hora
                retorno['status'] = 'sucesso';
                retorno['operacao'] = 'Sucesso ao manter atividade';
            break;
            case 'RQ':
                switch(codigoEvento) {
                    case 'C': // resposta do Mantem atividade
                        retorno['status'] = 'sucesso';
                        retorno['operacao'] = 'Sucesso ao manter atividade';
                    break;
                }
            break;
            case 'EC':
                retorno['operacao'] = 'Configuração enviada com sucesso';
                retorno['status'] = 'sucesso';
            break;
            case 'ECAR':
                switch(codigoEvento) {
                    case '20':
                        retorno['operacao'] = 'Solicita envio de cartões';
                        retorno['status'] = 'sucesso';
                    break;
                    case '1':
                        retorno['operacao'] = 'Sucesso ao gravar cartão';
                        retorno['status'] = 'sucesso';
                    break;
                }
            break;
            case 'REON':

            // console.log('\nAQUI Mensagem: '+options.mensagem);
            // console.log(vMensagem);

                retorno['numeroLeitora'] = vMensagem[5].charAt(0);
                
                switch(retorno['numeroLeitora']) {
                    case '5':
                        retorno['leitora'] = 'Biometria'; // pega o primeiro digito, vem outros que são do protocolo 8x
                    break;
                    case '4': // Teclado
                    retorno['leitora'] = 'Teclado'; // Teclado
                break;
                    case '3': // no embarcado é a leitora 4 que chega como 3
                        retorno['leitora'] = 'Barras'; // Omini
                    break;
                    case '2': 
                        retorno['leitora'] = 'Wiegand'; // Proximidade
                    break;
                    case '1':
                        retorno['leitora'] = 'Impressora';
                    break;
                }

                // console.log('leitora utilizada na entrada '+retorno['leitora'] + ' numero '+vMensagem[5].charAt(0));




                switch(codigoEvento) {
                    case '123':
                        retorno['operacao'] = 'Impressora sem papel';
                        retorno['status'] = 'sucesso';
                    break; 
                    case '6': // Liberação de saida e impressão
                        if(retorno['leitora'] === 'Impressora')
                           retorno['operacao'] = 'Resposta da impressão - sucesso';
                        else
                	      retorno['operacao'] = 'Resposta da liberação - liberado';

                        retorno['status'] = 'sucesso';
                    break;
                    case '0': // Evento online
                        vDataHora = vMensagem[2].split(' ');

                        retorno['matricula'] = matricula;
                        retorno['data'] = vDataHora[0];
                        retorno['hora'] = vDataHora[1];
                        

                    	retorno['sentido'] = 'Saída';
                    	retorno['operacao'] = 'Pedido de liberação';

                        if(matricula && matricula !== 'undefined')
                            retorno['status'] = 'sucesso';
                        else
                            retorno['status'] = 'erro';
                    break;
                    case '1':
                        retorno['operacao'] = 'Operação realizada com sucesso';
                        retorno['status'] = 'sucesso';
                    break;

   case '37': // n tenho certeza
        retorno['operacao'] = 'Operação realizada com sucesso';
        retorno['status'] = 'sucesso';
    break;
                  
                    case '30': // acesso negado
                        retorno['operacao'] = 'Resposta da liberação - bloqueado';
                        retorno['observacao'] = 'Acesso bloqueado'
                        retorno['status'] = 'sucesso';
                    break;
                    case '80': // Aguardando giro (resposta recebida e aguardando giro)
                        retorno['operacao'] = 'Aguardando giro';
                        retorno['status'] = 'sucesso';
                    break;
                    case '81': // giro da catraca (usuario passou pela catraca)
                        retorno['operacao'] = 'Resposta da liberação - liberado';
                        retorno['matricula'] = matricula;
                        retorno['status'] = 'sucesso';
                    break;
                    case '82':
                        retorno['operacao'] = 'Desistência de giro';
                        retorno['matricula'] = matricula;
                        retorno['status'] = 'sucesso';
                    break;
                    case '83':
                        retorno['operacao'] = 'Catraca forçada';
                        retorno['observacao'] = 'Catraca está sendo forçada ou usada incorretamente'
                        retorno['status'] = 'sucesso';
                    break;
                    case '84': // Reservado
                        retorno['operacao'] = '';
                        retorno['status'] = 'sucesso';
                    break;
                    case '85': // Timeout de depósito de cartão
                        retorno['operacao'] = 'Cartão não depositado';
                        retorno['observacao'] = 'Timeout de depósito de cartão'
                        retorno['status'] = 'sucesso';
                    break;
                    case '88': // cofre bloqueado (tem cartao no cofre)
                        retorno['operacao'] = 'Cofre bloqueado';
                        retorno['status'] = 'sucesso';
                    break;
                }
            break; // fim case 'REON':
        } // fim switch(operacao) {
    }
    
    return retorno;
}










/*
FUNÇÕES AUXILIARES
*/



var hex = "0123456789ABCDEF";
var almostAscii = ' !"#$%&' + "'" + '()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[' + '\\' + ']^_`abcdefghijklmnopqrstuvwxyz{|}';

var gerarProtocolo = function(sPacote) {
	if(!sPacote)
		return false;

    sByteInicial = "02 ";
    sTamanhoMensagem = gerarTamanhoString(sPacote);
    mensagem = asciiParaHex(sPacote);
    sCheckSun = gerarCheckSum(sPacote);
    sByteFinal = " 03";

    sPacote8x = sByteInicial + sTamanhoMensagem + mensagem + sCheckSun + sByteFinal;
    sPacote8xFinal = hexParaAscii(sPacote8x);

    /*console.log("\n\n\n+++DEBUG++++++DEBUG++++++DEBUG++++++DEBUG++++++DEBUG++++++DEBUG++++++DEBUG+++");
    console.log("pacote: "+sPacote);
    console.log("pacote 8x: "+sPacote8x);
    console.log("pacote 8x final: "+sPacote8xFinal);
    console.log("+++DEBUG++++++DEBUG++++++DEBUG++++++DEBUG++++++DEBUG++++++DEBUG++++++DEBUG+++\n\n\n");*/

    return sPacote8xFinal;
}

var gerarCheckSum = function(sPacote) {
    var i;
    var check = 0;

    var paramLength = sPacote.length;

    for (i = 0; i < paramLength; i++)
    {
        var textPos = sPacote.charAt(i);
        var val = almostAscii.indexOf(textPos) + 32;
        check ^= val;
    }

    check ^= paramLength % 256;
    check ^= paramLength / 256;

    var h16 = Math.floor(check / 16);
    var h1 = check % 16;

    return (hex.charAt(h16) + hex.charAt(h1));
}

var gerarTamanhoString = function(sPacote) {
    var paramLength = sPacote.length;

    var h1 = paramLength % 256;
    var h16 = Math.floor(paramLength / 256);


    var h1Str = h1.toString(16);
    if (h1Str.length == 1)
    {
        h1Str = '0' + h1Str;
    }
    var h16Str = h16.toString(16);
    if (h16Str.length == 1)
    {
        h16Str = '0' + h16Str;
    }

    var tempStr = h1Str + ' ' + h16Str + ' ';

    return tempStr.toUpperCase();
}

var asciiParaHex = function(sPacote) {
    var r = "";
    for (i = 0; i < sPacote.length; i++) {
        var let = sPacote.charAt(i);
        var pos = almostAscii.indexOf(let) + 32;
        var h16 = Math.floor(pos/16);
        var h1 = pos%16;
        r+=hex.charAt(h16)+hex.charAt(h1) + ' ';
    }

    return r;
}

var hexParaAscii = function(sPacote) {
    var tmp = sPacote;
    var arr = tmp.split(' ');
    var str = '';
    for (var i=0; i<arr.length; i++) {
    c = String.fromCharCode(parseInt(arr[i],16));
    str += c;
    }

    return str;
}



/*
Evento Online

O código do evento é utilizado tanto em registros online quanto offline.
Enquanto que no offline, só fica armazenado o status final da operação (ex: liberado, negado, negado por senha), no registro online essa flag também é utilizada para informar ao servidor o que o equipamento está solicitando (ex: Aguardando validação, indica que o servidor deve enviar uma resposta so equipamento para aquele registro).



0 - Aguardando validação: Equipamento está aguardando uma resposta do servidor para o evento enviado.
1 - Liberado: Indica que o evento foi validado e liberado. Em caso de catraca libera ambos os lados.
2 - Giro de catraca: obsoleta, indicado agora em 81.
3 - Liberado por Master: Indica que a liberação foi feita através de cartão master.
4 – Liberação online: Indica que foi enviada uma liberação através do webserver ou aplicativo.
5 - Libera entrada: Libera indicando direção (catraca).
6 - Libera saída: Libera indicando direção (catraca).
7-  Liberado master:
8-  Liberado saída com revista


20 - Mensagem: Indica ao equipamento que deve ser exibida uma mensagem no display de acordo com os parâmetros informados.
21 - Status: Reservado para implementação futura.
22 - Tamper interno acionado: Tamper interno foi acionado (equipamento aberto indevidamente).
23 - Tamper externo acionado: Tamper externo (parede) foi acionado.

30 - Negado: Acesso negado.
31 - Negado por horário: Fora do horário cadastrado. Pode ser indicado pelo servidor ou pelo equipamento no modo offline.
32 - Negado por acesso: Usuário não possui os privilégios para acessar o equipamento. Pode ser indicado pelo servidor ou pelo equipamento no modo offline.
33 – Negado por senha: A senha digitada não confere com a cadastrada.
34 – Negado por sequência de acesso: A sequência de acesso não foi correta.
35 – Negado por validade do cartão: Cartão está fora da validade.
36 – Negado por sentido: Sentido está errado (entrar sem sair, sair sem entrar)



40 – Senha de Emergencia: Usuário utilizou senha de emergência.

80 - Aguardando Giro: Indica que o equipamento recebeu a validação, e agora está aguardando o usuário transpor a catraca.
81 - Giro de catraca: Usuário transpôs a catraca.
82 - Desistência de giro: Usuário desistiu de transpor a catraca.
83 - Catraca forçada: Catraca está sendo forçada ou usada incorretamente.
84 - Reservado
85 - Timeout de depósito de cartão.
86 - Não foi possivem detectar o módulo de expansão.
87 - Reservado
88 - Cofre bloqueado


90 – Desistência: Reservado
91 – Timeout online: Servidor não respondeu a requisição do equipamento no tempo definido.

95 - Botão: Botão foi pressionado.

100 - Alarme: Entrada digital atrelada à alarme foi acionada.

120 - Porta aberta: Porta está aberta.
*/

/* erros
Código	Descrição
0	Não há erro
1	Não há dados
2 à 9	Reservado
10	Comando desconhecido
11	Tamanho do pacote é inválido
12	Parâmetros informados são inválidos
13	Erro de checksum
14	Tamanho dos parâmetros são inválidos
15	Número da mensagem é inválido
16	Start Byte é inválido
17	Erro para receber pacote
18 à 19	Reservado
20	Não há empregador cadastrado
21	Não há usuários cadastrados
22	Usuário não cadastrado
23	Usuário já cadastrado
24	Limite de cadastro de usuários atingido
25	Equipamento não possui biometria
26	Index biométrico não encontrado
27	Limite de cadastro de digitais atingido
28	Equipamento não possui eventos
cls	Erro na manipulação de biometrias
30	Documento do empregador é inválido
31	Tipo do documento do empregador é inválido
32	Ip é inválido
33	Tipo de operação do usuário é inválida
34	Identificador do empregado é inválido
35	Documento do empregador é inválido
36	Referencia do empregado é inválida
37	Referencia de cartão de usuario é inválida
38 à 42	Reservado
43	Erro ao gravar dados
44	Erro ao ler dados
45 à 49	Reservado
50	Erro desconhecido
51 à 60	Reservado
61	Matrícula já existe
62	Identificador já existe
63	Opção inválida
64	Matrícula não existe
65	Identificador não existe
66	Cartão necessário mas não informado
67 à 179	Reservado
180	Horário contido no usuário não existe
181	Período contido no horário não existe
182	Escala contida no usuário não existe
183	Faixa de dias da semana não informada ou inválida (acionamento e períodos)
184	Hora não informada ou inválida (acionamento e períodos)
185	Período não informado ou inválido (horários)
186	Horário não informado ou inválido (cartões)
187	Indice não informado ou inválido (horários, periodos e acionamentos)
188	Data não informada ou inválida (feriados)
189	Mensagem não informada (funções)
190	Erro na memoria (acionamento)
191	Mensagem não informada (funções)
192	Informação de tipo de acesso invalida
193	Informação de tipo decartão invalida
194 à 239	Reservado
240	Registro não foi encontrado (Grupos de acesso, período, horários, acionamentos)
241	Registro já existe (Grupos de acesso, período, horários, acionamentos)
242	Registro não existe (Grupos de acesso, período, horários, acionamentos)
243	Limite atingido (Grupos de acesso, período, horários, acionamentos)
244	Erro no tipo de operação (Grupos de acesso, período, horários, acionamentos)
*/
