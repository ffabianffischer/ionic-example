angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, User, $state) {
    $scope.credentials = {};
    $scope.loginBenutzer = function() {
        User.login({include: 'user', rememberMe: true}, $scope.credentials,
                   function() {
                        $state.go("tab.fragen");            
                   },
                   function(res) { 
                        alert(0); 
                   }); 
    }    
    $scope.zurRegistrierung = function() {
        $state.go("registrierung"); 
    };
})

.controller('RegistrierungCtrl', function($scope, User, $state) {   
    $scope.credentials = {};
    $scope.registrierungOnline = function(){
        User.create($scope.credentials).$promise
                .then(function (res) {
                    $state.go("login"); 
                }, function (err) { alert(0); });
    }
})

.controller('DashCtrl', function($scope) {})

.controller('ProfilCtrl', function($scope, User, $state) {
    $scope.profil = User.getCurrent();
    $scope.profilneu = {};
    $scope.profilUpdate = function(){
        $scope.profil.statustext = $scope.profilneu.statustext;
        User.prototype$updateAttributes({id: $scope.profil.id}, $scope.profil)
    }
    $scope.profilLogout = function () {
        User.logout(function () {
            $state.go("login"); 
        });
    }
})

.controller('FragenCtrl', function($scope, Frage, $ionicModal) {
    $scope.fragen = Frage.find();
    $scope.neueFrage = function(){
        $ionicModal.fromTemplateUrl('templates/neue-frage.html', {
        scope: $scope, 
        animation: 'slide-in-up'
        }).then(function(modal) {$scope.modal = modal; modal.show();});
    }
    $scope.fragenladen = function() {
        $scope.fragen = Frage.find();
        $scope.$broadcast('scroll.refreshComplete');
    }
    $scope.$on( "$ionicView.enter", function( scopes, states ) {
            if( states.fromCache && states.stateName == "tab.fragen" ) {
                $scope.fragenladen();
            }
    });
})

.controller("NeueFrageCtrl", function($scope, Frage){
    $scope.neueFrageSpeichern = function(){
        $scope.frage = Frage.create({ text: $scope.fragetext });
        $scope.modal.remove();
        $scope.fragenladen();
    }
})

.controller('FrageDetailCtrl', function($scope, $stateParams, Frage, $ionicHistory) {
    $scope.frage = Frage.findById({ id: $stateParams.frageId });
    $scope.frageLoeschen = function() {
        Frage.deleteById({ id: $stateParams.frageId }).$promise;
        $ionicHistory.goBack();     
    } 
    $scope.data = {};
    $scope.frageAendern = function(){
        $scope.frage.text = $scope.data.text;
        $scope.frage.$save();
    }
    
});
