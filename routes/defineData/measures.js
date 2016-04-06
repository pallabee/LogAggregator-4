var express = require('express');
var measureRouter = express.Router();
// var mongoose = require('mongoose');
// var Namespace = require('../model/db').namespaceModel;
var measureList = [{
  "dispName": "No of Hits"
}, {
  "dispName": "Failed Requests"
}, {
  "dispName": "Average Visitor Stay Length"
}, {
  "dispName": "Average Bandwidth per Day"
}]
/* GET Measures */
measureRouter.get('/', function(req, res){
 res.send(measureList);
 });
// /* GET Measures */
// router.get('/', function(req, res) {
//   if (req.session.oid !== null) {
//     Namespace.findNamespace(req.session.oid, function(err, namespace) {
//       if (namespace != null) {
//         res.send(namespace.measures);
//       }
//     });
//   }
// });
//
// /* POST Measures */
// router.post('/addMeasure', function(req, res) {
//   if (req.session.oid !== null) {
//     Namespace.findNamespace(req.session.oid, function(err, namespace) {
//       if (namespace != null) {
//         if (req.body.measureEventSelector == "") {
//           var fieldEventValue = req.body.measureFieldSelector;
//         } else {
//           var fieldEventValue = req.body.measureEventSelector;
//         }
//         namespace.measures.push({
//           displayName: req.body.displaymeasurename,
//           aggrFunc: req.body.aggregator,
//           fieldEvent: fieldEventValue,
//           filterField: req.body.filterfield,
//           filterValue: req.body.filtervalue,
//         });
//         namespace.save(function(err, namespace) {
//           console.log('namespace saved:', namespace);
//         });
//       }
//     });
//   }
//   res.redirect('/');
// });
//
// /* Delete Measure */
//
// router.post('/:id', function(req, res) {
//   console.log("deleted value is", req.params.id);
//   res.redirect('/');
// });

module.exports = measureRouter;