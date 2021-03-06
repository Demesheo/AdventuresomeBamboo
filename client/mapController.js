// need to set up stateName require and data handling, keep getting errors
// var cropSelections = require('../state_selection_dbs/selectionData.js');

var app = angular.module('map', ['ngAnimate']);
  // Defining our map controller

app.controller('mapController', function($scope, $http){
    // Setting our $scope statename that will change on click
    // Will pass in later to get data from state selection DB

    $scope.init = function(){
      $('#vmap').vectorMap({ map: 'usa_en',
        backgroundColor: 'white',
        borderColor: '#818181',
        borderOpacity: 0.25,
        borderWidth: 1,
        color: '#18bc9c',
        enableZoom: false,
        hoverColor: '#2c3e50',
        hoverOpacity: null,
        showTooltip: false,
        normalizeFunction: 'linear',
        scaleColors: ['#b6d6ff', '#005ace'],
        selectedColor: '#2c3e50',
        selectedRegion: null, 
        onRegionClick: function(element, code, region){ 

          $scope.stateName = region;
          $scope.cropInfo = [];
          $scope.crops = [];
          $http.post('/state?'+region, region)
          .then(function(response){
            $scope.types = response.data
          })
        }
      });
    };

    $scope.init(); // puts our map on the page,
    $scope.getCrops = function(){
      $http.post('/cropType?'+this.type)
      .then(function(response){
        $scope.crops = response.data;
      })
    };

    $scope.getCropDetails = function(){
       $http.post('/crop?'+this.crop)
       .then(function(response){
        $scope.cropInfo = {};
        var compareThisArray = [];
        if(!response.data.length){
          $scope.cropInfo = ['NO DATA TO DISPLAY'];
        }else{
          $scope.details = response.data.forEach(function(dets){
            if(dets.unit_desc === '$')
            $scope.cropInfo[dets.year] = {'Year' : dets['year'], 'Amount' : dets['value'], 'unit_desc' : dets['unit_desc'], 'Class' : dets['class_desc']};
          })
        }
       })
    }
    $scope.replaceChars = function(str){
     str = str.replace(/%20/g,' ');
     return str.replace(/%26/g,'&');
    }
  })