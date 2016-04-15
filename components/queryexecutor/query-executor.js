  var sift = require('sift');
  var _ = require('highland');
  var rollingCount=require('../rollingCount/AccumulateOverCount.js');
  var sum = require('../aggregator/sum-aggregator');
  var count = require('../aggregator/count-aggregator');
  var average = require('../aggregator/avg-aggregator');
  var min = require('../aggregator/min-aggregator');
  var max = require('../aggregator/max-aggregator');
  var rollingTime=require('../rollingTime/time-accumulator.js')

  function getAggregator(aggregator) {

    switch (aggregator) {
      case 'average':
      return average;
      break;
      case 'min':
      return min;
      break;
      case 'max':
      return max;
      break;
      case 'average':
      return average;
      break;
      case 'count':
      return count;
      break;
      case 'sum':
      return sum;
      break;
      default:

    }
  }

  var QueryExecutor = function(query) {
  var self = this;
  self.query = query;
  var RC=new Array();
  var RT=new Array();

  if(query.eval.val1.rolling.over.time){
  RT.push(new rollingTime(query.eval.val1.rolling.over.time,getAggregator(query.eval.val1.rolling.evaluate))); //rollingTime not available
  }
  else {
  console.log("**************count intitalized for val1********************* for "+query.eval.val1.rolling.over.count);
  RC.push(new rollingCount(query.eval.val1.rolling.over.count,average));//assume every computation is either rollingTime or rollingCount
  }
  if(query.eval.val2.rolling.over.count){
  console.log("**************count intitalized for val2*********************");
  RC.push(new rollingCount(query.eval.val1.rolling.over.count,average));
  }
  else {
  RT.push(new rollingTime(query.eval.val1.rolling.over.time,getAggregator(query.eval.val1.rolling.evaluate)));  //assume every computation is either rollingTime or rollingCount
  }

  self.getPipeline = function() {
  return self.createPipeline(self.query);
  }
  self.createPipeline = function(query) {
    var pipeline = [];
    if(query.hasOwnProperty('from') && query.from.hasOwnProperty('where')) {
    var sifter = sift(query.from.where);
    pipeline.push(_.filter(sifter));
    }
    pipeline.push(_.map(function(obj) {
      // console.log('in query exec ');
      var siftobj=new Object();
      expkeys=query.select;
      siftobj.filter=function(value) {
      var temp=new Object();
      for (var i = 0; i < expkeys.length; i++) {
        temp[expkeys[i]]=value[expkeys[i]];
      }
      var RTCount=0,
          RCCount=0;
      if(query.eval.val1.rolling.over.time){
      temp.val1=RT[RTCount++].evaluate(value[query.eval.val1.rolling.on]); //rollingTime not available
      }
      else {
        temp.val1=RC[RCCount++].evaluate(value[query.eval.val1.rolling.on]);//assume every computation is either rollingTime or rollingCount
      }
      if(query.eval.val1.rolling.over.count){
        temp.val2=RC[RCCount++].evaluate(value[query.eval.val1.rolling.on]); //rollingTime not available
      }
      else {
        temp.val2=RT[RTCount++].evaluate(value[query.eval.val1.rolling.on]);//assume every computation is either rollingTime or rollingCount
      }
      return temp;
      }
      var data={
        filter:obj
      };
      var testQuery=sift(siftobj);
      var tempdata=testQuery(data);  //testQuery returns object with val1 and val2 set
      var condition=query.project.$highlight.$condition;
      condition=condition.replace('val1','tempdata.val1');
      condition=condition.replace('val2','tempdata.val2')
                                                 //filter that returns true/false depending on query condition
                                                 //{val1: {$gte: '$val2'}}//query.project.$highlight.$condition
                                                 //highlight set to true/false depending on val1 and val2
       if(tempdata.val1 && tempdata.val2){
       tempdata.highlight=eval(condition)
       }
       else {
      tempdata.highlight=false;
       }
      // console.log(tempdata);
      return tempdata; //object with select parameters and highlight
    }));
    return _.pipeline.apply(this, pipeline);
  };
};

exports = module.exports = QueryExecutor;
