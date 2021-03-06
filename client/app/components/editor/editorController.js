//TODO: Do we need to inject the CodeMirror dependency directly?

angular.module('RecallJS')
  .controller('EditorController', function($window, $scope, $location, LearningAlgo, CodeEval, $http){

    init();

    function init() {
      // we only want to get a new problem if we don't have a current one. Otherwise,
      //   every time we switch routes (e.g., switching between library and practice),
      //   we will get a new problem, which we don't want
      var problem = LearningAlgo.getProblem();

      // error checking in case if no problems are present
      if (!problem) {
        console.log("There are no problems left!");
        // TODO: Have something here cause the view to display something that
        // says, problems done! Would you like to add more, and link to library
        return;
      }

      $scope.title = problem.title;
      $scope.prompt = problem.prompt;
      $scope.examples = problem.examples;
      $scope.showSolution = false;

      //CodeMirror options set here. For full configuration options see http://codemirror.net/doc/manual.html
      $scope.cmEditor = {
        lineWrapping : true,
        lineNumbers: true,
        mode: 'javascript',
        indentUnit: 2,
        theme:'twilight',
      };

      //Displays solution within a CodeMirror element, but disables focus/editi
      $scope.cmSolution = {
        lineWrapping : true,
        lineNumbers: true,
        mode: 'javascript',
        indentUnit: 2,
        theme:'twilight',
        readOnly: 'nocursor',
      };

      $scope.code = "var " + problem.functionName + " = function(){/*YOUR CODE HERE*/};";
      $scope.solution = problem.solution
    }

    $scope.testResults = function(){
      // Calls CodeEval factory in order to displays results
      // $scope.code is data-bound to whatever the user edits and can be passed in to CodeEval for evaluation
      var results = CodeEval.run(LearningAlgo.currProblem, $scope.code);
      $scope.numCorrect = results.numCorrect + " of " + results.numTests + " test(s) passed."
      $scope.corrDetails = results.details.correct;
      $scope.incorrDetails = results.details.incorrect;
      $scope.showTestDetails = true;
    };

    $scope.submitCode = function(){
      var results = CodeEval.run(LearningAlgo.currProblem, $scope.code);
      $scope.numCorrect = results.numCorrect + " of " + results.numTests + " test(s) passed."
      $scope.corrDetails = results.details.correct;
      $scope.incorrDetails = results.details.incorrect;
      $scope.showSolution = true;
    };

    $scope.setRating = function(rating){
      console.log("Problem was rated:", rating);
      // TODO: Send data about problem back to server
      var user = JSON.parse($window.localStorage.getItem('com.recalljs'));
      var attempt = {
        timeSubmitted: Date.now(),
        rating: rating,
        // TODO: make percent work
        percentTestsPassed: 100,
        timeStarted: Date.now(),
        // TODO: make numrums work
        numRuns: 1,
      };
      user.problems.forEach(function(item){
        if ($scope.title === item.title){
          item.attempts.push(attempt);
        }
      });
      // We want to update the localstorage so next time it gets it, it will have the updated attempts;
      $window.localStorage.setItem('com.recalljs', JSON.stringify(user));
      $http({
        method: 'POST',
        url: '/users/update',
        data: user
      });

      // remove current problem and refresh view
      LearningAlgo.currProblem = null;
      $scope.showTestDetails = false;
      init();
    };
  });