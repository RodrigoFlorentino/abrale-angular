(function () {
    'use strict';

    angular.module('app.chatService', [])
        .factory('chatService', chatService);

    chatService.$inject = ['$http','$filter','$log','$q'];

    function chatService($http, $filter, $log, $q) {

        var qtdChat = 0;
        var qtdConv = 0;

        return {
            getChat: getChat,
            retornaQdt: retornaQdt,
            retornaQdtChat: retornaQdtChat
        };

        function getChat() {

            var retorno = [];
            var listaId = [];

            return $http.get('/api/logconversation/treinamento')
                .then(retornaChat)
                .catch(errorChat);

            function retornaChat(response){

                var data = response.data;
                var pos = 0;
                qtdChat = 0;

                angular.forEach(data.docs, function(item){

                    var jsonParam = {};
                    angular.forEach(item.response.entities, function(ent){
                        jsonParam.entidade = ent.entity;
                        jsonParam.confidenceEntidade =parseFloat((ent.confidence*100).toFixed(2)) ;
                    });

                    angular.forEach(item.response.intents, function(int){
                      jsonParam.intencao = int.intent;
                      jsonParam.confidenceIntencao = parseFloat((int.confidence*100).toFixed(2)) ;
                    });

                    angular.forEach(item.response.input, function(text){
                        if(text.length!=0)jsonParam.msgUser = text;
                    });

                    if(item.response.context.conversation_id.length!=0){
                        jsonParam.conversation_id = item.response.context.conversation_id;
                        jsonParam.data = $filter('date')(item.response_timestamp, "dd/MM/yyyy HH:mm:ss");
                        jsonParam.id=item.log_id;
                        jsonParam.treinado=item.treinado;
                    }

                    if(!angular.equals(jsonParam, {})){
                        retorno.push(jsonParam);
                    }

                    if (!listaId.includes(item.response.context.conversation_id)){
                        listaId.push(item.response.context.conversation_id);
                    }

                    qtdChat = qtdChat + 1;

                });

                qtdConv = listaId.length;

                if(retorno.length!=0){
                    retorno.push({selected: {}});
                }

                return retorno;

            }

            function errorChat(error){
                var newMessage = 'XHR Failed for getChat.';
                $log.error(newMessage);
                $log.error(error);
                return $q.reject(error);
            }

        };

        function retornaQdt(){
            return qtdChat;
        };

        function retornaQdtChat(){
            return qtdConv;
        }

    }
})();
