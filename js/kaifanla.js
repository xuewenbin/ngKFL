var app= angular.module("myModule",['ng','ngRoute']);
//页面跳转
app.config(function($routeProvider){
    $routeProvider.when('/start',{templateUrl:'tpl/start.html'})
        .when('/main',{templateUrl:'tpl/main.html',controller:'mainCtrl'})
        .when('/detail',{templateUrl:'tpl/detail.html'})
        .when('/detail/:id',{templateUrl:'tpl/detail.html',controller:'detailCtrl'})
        .when('/order',{templateUrl:'tpl/order.html'})
        .when('/order/:id',{templateUrl:'tpl/order.html',controller:'orderCtrl'})
        .when('/myOrder',{templateUrl:'tpl/myOrder.html',controller:'myOrderCtrl'})
        .otherwise({redirectTo:'/start'});
});
//页面跳转
app.controller('parentCtrl',function($scope,$location){
    $scope.jump=function(url){
        $location.path(url);
    }
});
//main加载
app.controller('mainCtrl',function($scope,$http){
    $scope.dishList=[];
    $scope.kw='';
    $scope.hasMore=true;

    $http.get('data/dish_getbypage.json').success(function(data){
        $scope.dishList=data;
        console.log($scope.dishList);
    }).error(function(data){
        conlose.log("获取main信息出错"+data);
    });

    //对input的监听 kw
    $scope.$watch('kw',function(){
        //console.log($scope.kw);
        if($scope.kw!=''&&$scope.kw.length>0){
            $http.get('data/dish_getbykw.json?kw'+$scope.kw).success(function(data){
                $scope.dishList=data;
            }).error(function(data){
                console.log('获取搜索信息出错'+data);
            });
        }
    })

    //加载更多
    $scope.loadMore=function(){
        $http.get('data/dish_getbypage.json').success(function(data){
            $scope.hasMore=false;
            $scope.dishList=$scope.dishList.concat(data);
        }).error(function(data){
            console.log('获取更多信息出错'+data);
        });
    };
});
//详情页
app.controller('detailCtrl',function($scope,$routeParams,$http){
    $scope.dishId=$routeParams.id;
    $scope.dish= new Object();
    $http.get('data/dish_getbyid.json?id='+$scope.dishId).success(function(data){
        $scope.dish=data[0];
    }).error(function(data){
        console.log("获取数据出错");
    });
});
//订单页
app.controller('orderCtrl',function($scope,$routeParams,$http){
    $scope.user={'did':$routeParams.id};
    $scope.submitOrder=function(){
        var str = jQuery.param($scope.user);
        console.log("str"+str);
        $http.get('data/order_add.json?'+str).success(function(data){
            $scope.succMsg=data[0].msg;
            $scope.orderId = data[0].did;
        }).error(function(data){
           console.log(data);
            $scope.errorMsg=data;
        });
    }
});
//订单中心
app.controller('myOrderCtrl',function($scope,$http){
    $scope.dishList=[];
    $http.get('data/order_getbyphone.json').success(function(data){
        $scope.dishList=data;
    }).error(function(data){
        console.log("获取订单信息失败");
    });
});