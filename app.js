 
//app = angular.module("reddit-clone'",["firebase","ngRoute",]); //引入寫法
//var ref= new Firebase("https://redditclone123.firebaseio.com/");//引入寫法
//var sync= $firebase(ref);  //
// $scope.savePost =sync.$asArray();
///////////
var app = angular.module('reddit-clone',['ngRoute','firebase']); //引入寫法
app.constant('fbURL','https://redditclone123.firebaseio.com/');
//factory fetch the thing in the url 
app.factory('Posts',function($firebase,fbURL){
 return $firebase (new Firebase(fbURL)).$asArray();
 });


app.config(function($routeProvider){
     $routeProvider
     .when('/',{
           controller:'MainController',
           templateUrl:'main.html'

     })

         .otherwise({
            redirectTo:'/'

         })

});

//之前以上的都寫在controller裏 這邊寫在之前

app.controller("MainController",function ($scope,$firebase,Posts) {
 $scope.posts=Posts;

//創造一個savepost function,這是main.html裡ng-click的
$scope.savePost= function(post){

  //if (post.name && post.description && post.url && $scope.authData){
 if ( post.description && $scope.authData){
Posts.$add({
     //name:post.name,
     description:post.description,
    // url:post.url,
     votes:0,
     user:$scope.authData.facebook.displayName

   })

 // post.name=" ";
  post.description=" ";
 // post.url=" ";

  }else{

    alert('請輸入訊息並請登入facebook')
  }
}

//刪除post
$scope.deletePost= function(post){
  var postForDeletion = new Firebase('https://redditclone123.firebaseio.com/' + post.$id);
  postForDeletion.remove();

}

$scope.addVote= function(post){
 post.votes++;

 //把投票數存起來到firebase沒這行的話只有數字會跳 存不了
 Posts.$save(post);

}

$scope.addComment=function(post,comment){
  //if($scope.authData){                      //comments是一個儲存陣列 ,comment是裡面參數;add有存的功能
    if(true){ 
       var ref = new Firebase('https://redditclone123.firebaseio.com/'+ post.$id +'/comments');
       var sync= $firebase(ref);
       $scope.comments=sync.$asArray();
       $scope.comments.$add({
             user:$scope.authData.facebook.displayName,
             userid:$scope.authData.facebook.id,
             text:comment.text

       });

       
  }else{

    alert('登入facebook來評論');
  }

  comment.text="";
}


$scope.removeComment=function(post,key){
   var deleteComment = 
    new Firebase('https://redditclone123.firebaseio.com/'+ post.$id +'/comments/'+key);
    deleteComment.remove();


}



$scope.login=function(){
 var ref = new Firebase("https://redditclone123.firebaseio.com");
ref.authWithOAuthPopup("facebook", function(error, authData) {
  if (error) {
   // console.log("Login Failed!", error);
    alert('登入失敗');
  } else {
    //console.log("Authenticated successfully with payload:", authData);
    alert('登入成功');
  }
  $scope.authData=authData;

});
}






});




 

