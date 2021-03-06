angular.module('RecallJS')
  .controller('CreateController', function($scope, $location, ProblemData){
    // TODO: Will want to have this as a Factory to share with
    // server and the Library
    $scope.problem = {};
    $scope.problems = [];
    $scope.tests = [];
    $scope.examples = [];

    $scope.addExample = function(example) {
      // only want to add an example if it is unique
      var idx = $scope.examples.indexOf(example);
      if (idx === -1) {
        $scope.examples.push(example);
      }
    };

    $scope.removeExample = function(example) {
      var idx = $scope.examples.indexOf(example);
      $scope.examples.splice(idx, 1);
    };

    $scope.addTest = function(input, output){
      // only want to add a test input is unique
      var newTest = {input: JSON.parse(input), output: JSON.parse(output)};
      var found = false;
      $scope.tests.forEach(function(test){
        if (test.input === newTest.input) {
          found = true;
        }
      });

      if (!found) {
        $scope.tests.push(newTest);
      }
    };

    $scope.removeTest = function(test) {
      var idx = $scope.tests.indexOf(test);
      $scope.tests.splice(idx, 1);
    };

    $scope.submitProblem = function() {
      $scope.problem.examples = $scope.examples;
      $scope.problem.tests = $scope.tests;
      $scope.problems.push($scope.problem);
      ProblemData.create($scope.problem);

      // redirect to show user new view after problem creation
      $location.path('/library');
    };

    // TODO: Refactor to use a service since it is repeated here
    //  and in editorController. Move both cmEditor and cmSolution
    //CodeMirror options set here. For full configuration options see http://codemirror.net/doc/manual.html
    $scope.cmEditor = {
      lineWrapping : true,
      lineNumbers: true,
      mode: 'javascript',
      indentUnit: 2,
      theme:'twilight',
    };
  });