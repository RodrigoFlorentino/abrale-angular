(function () {
    'use strict';

    angular.module('app.chat', ['ngAnimate','ngSanitize','ui.bootstrap','app.chatService'])
        .controller('chatController', chatController);

        chatController.$inject = ['$rootScope','$scope','$log','$http','$uibModal','$window','chatService'];

        function chatController($rootScope,$scope,$log,$http,$uibModal,$window,chatService) {

            var vm      = this;
            vm.buscar   = buscar;
            vm.sort_by  = sort_by;
            vm.showDown = showDown;
            vm.showUp   = showUp;

            vm.modalEntidade    = modalEntidade;
            vm.toggleSelection  = toggleSelection;
            vm.modalIntencao    = modalIntencao;

            vm.opcaoTreinamento = ["Sim", "Não"];
            vm.tpTreinamento    = ["Intenção", "Entidade"];
            vm.prcConfianca     = ["10", "20","30","40","50","60","70","80","90","100"];
            vm.sinalMaiorMenor  = ["<=", ">="];
            vm.selection        = [];

            vm.mostrarbtnInt = false;
            vm.mostrarbtnEnt = false;
            vm.disableBtnTreinarIntencao = true;
            vm.disableBtnTreinarEntidade = true;

            vm.items = [];

            vm.sortType     = 'name';
            vm.sortReverse  = true;

            buscar();

            function getJson() {
                return chatService.getChat().then(function(data) {
                    vm.items = data;
                });
            }

            function buscar() {
                $scope.loading = true;
                getJson();
                $scope.loading = false;
            };

            function toggleSelection (id) {

                var idx = vm.selection.indexOf(id);

                if (idx > -1) {
                    vm.selection.splice(idx, 1);
                } else {
                    vm.selection.push(id);
                }

                if(vm.selection.length>0){
                    vm.disableBtnTreinarIntencao = false;
                    vm.disableBtnTreinarEntidade = false;
                } else {
                    vm.disableBtnTreinarIntencao = true;
                    vm.disableBtnTreinarEntidade = true;
                }
            };

            function sort_by(newSortingOrder) {
                vm.sortReverse = (vm.sortType === newSortingOrder) ? !vm.sortReverse : false;
                vm.sortType = newSortingOrder;
            };

            function showDown(newSortingOrder) {
                return vm.sortType == newSortingOrder && !vm.sortReverse
            };

            function showUp(newSortingOrder) {
                return vm.sortType == newSortingOrder && vm.sortReverse
            };

            function modalEntidade(size) {

                $uibModal.open({
                    scope: $scope,
                    animation: true,
                    controllerAs: '$ctrl',
                    templateUrl: 'core/navigation/modalEnt.html',
                    controller: 'modalController',
                    windowClass: 'custom-dialog',
                    backdrop:false,
                    size: size,
                    resolve: {
                        valPar: function(){
                            return 'entidade';
                        },
                        valSel: function () {
                           return vm.selection;
                         },
                         valItem: function(){
                            return vm.items;
                         }
                    }
                });
            };

            function modalIntencao(size) {

                $uibModal.open({
                    scope: $scope,
                    animation: true,
                    controllerAs: '$ctrl',
                    templateUrl: 'core/navigation/modalInt.html',
                    controller: 'modalController',
                    windowClass: 'custom-dialog',
                    backdrop:false,
                    size: size,
                    resolve: {
                        valPar: function(){
                            return 'intencao';
                        },
                        valSel: function () {
                           return vm.selection;
                        },
                        valItem: function(){
                            return vm.items;
                        }
                    }
                });
            };

        }

})();