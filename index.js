var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

var url = process.env.mongoURL || "mongodb://localhost:27017/";
var express = require('express');
var cors = require('cors') 
var bodyParser = require('body-parser')
var app = express();
var BNO = require('./bostonNewOrleans.json')
console.log(BNO, 'BNO', BNO.features[0].geometry)

var CMI = require('./chicagoMiami.json')
console.log(CMI, 'CMI', CMI.features[0].geometry)

var LAS = require('./lasVegasPheonix.json')
console.log(LAS, 'LAS', LAS.features[0].geometry)


var SEA = require('./seattleColorado.json')
console.log(SEA, 'SEA', SEA.features[0].geometry)


// CMI.features[0].geometry.coordinates = [  CMI.features[0].geometry.coordinates]
// BNO.features[0].geometry.coordinates = [  BNO.features[0].geometry.coordinates]

console.log(' -=-=-=-=-=- ')
console.log(' -=-=-=-=-=- ')
console.log(' -=-=-=-=-=- ')
console.log(' -=-=-=-=-=- ')
console.log(' -=-=-=-=-=- ')
console.log(' -=-=-=-=-=- ')
console.log(' -=-=-=-=-=- ')
console.log(' -=-=-=-=-=- ')
console.log(' -=-=-=-=-=- ')
console.log(' -=-=-=-=-=- ')
console.log(' -=-=-=-=-=- ')
console.log(' -=-=-=-=-=- ')
console.log(' -=-=-=-=-=- ')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var dbo; 


// url = `mongodb+srv://niko:nikoniko@cluster0-k13bi.mongodb.net/test?retryWrites=true&w=majority`


MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    //dbo = db.db("ironrest");
    dbo = db.db("CORONA");
    
    
    dbo.collection('corona').find({}).toArray(function(err, result) {
        if (err) throw err;
        //console.log(result)
    })

    // dbo.collection('corona').find(
    //     {
    //       location:
    //         { $near:
    //            {
    //              $geometry: { type: "Point",  coordinates: [ -73.9667, 40.78 ] },
    //              $minDistance: 1000,
    //              $maxDistance: 5000
    //            }
    //         }
    //     }).toArray(function(err, result) {
    //         if (err) throw err;
    //         console.log(result)
    //     })
     
    // dbo.collection('gbSmall').insertMany([

    //     {"sentiment" : 0.631925,
    //     "yyyy-mm" : "2012-9",
    //     "lat_lon" : [
    //         -2.0566385,
    //         52.84265
    //     ]}
    // ])


    // dbo.collection('gbSmall').findOne({
    //     lat_lon: {
    //         $geoIntersects: {
    //             $geometry: {
    //                 type: "LineString",
    //                 coordinates: [[-2.0566385,52.84265],[-3.0566385,52.84265]]
    //             }
    //         }
    //     }
    // },function(error, result){
    //     if( error ) throw error
    //     console.log('gbSmall',result, '-=-=-=')
    // })



    //    dbo.collection('loc').insert({ "loc" :  SEA.features[0].geometry }).then(res => console.log('panda',res)).catch(err=>console.log('iguana',err))
    // dbo.collection('loc').insert({ "loc" :  CMI.features[0].geometry }).then(res => console.log('panda',res)).catch(err=>console.log('iguana',err))

    //  var poly1 = { "type" : "Polygon", "coordinates" : [[[0, 0], [3, 0], [0, 3], [0, 0]]] }




    dbo.collection('loc').find().toArray(function(err, res){
        if( err ) throw err
        // console.log(res, '-=-=-')
    })  

    let loc1 = CMI.features[0].geometry 
    console.log(BNO.features[0].geometry.coordinates.length)
    // console.log(loc1)
     dbo.collection('loc').find({ "loc" : {
        "$geoIntersects" : {
            "$geometry" : SEA.features[0].geometry
        }   
    } }).toArray(function(err, result) {
        if (err) throw err
        console.log('geointerescts ',result,result[0].loc.coordinates.length,'-=-=-=-')
    })



    // // poly2 and poly3 returned
    //  dbo.collection('test').find({ "loc" : {
    //     "$geoWithin" : {
    //         "$geometry" : poly1
    //     }
    // } }).toArray(function(err, result) {
    //             if (err) throw err;
    //             console.log(' geowithin ',result, '-=-=-=-=-')
    // })
    // //poly2 returned








    //  //dbo.collection('test').drop()
     //var poly1 = { "type" : "Polygon", "coordinates" : [[[0, 0], [3, 0], [0, 3], [0, 0]]] }
    //  var poly2 = { "type" : "Polygon", "coordinates" : [[[1, 1], [2, 1], [1, 2], [1, 1]]] }
    // // poly1 is a similar triangle inside poly2
    //  var poly3 = { "type" : "Polygon", "coordinates" : [[[1, 0], [-2, 0], [1, 3], [1, 0]]] }
    // // poly3 is poly1 flipped around its "vertical" edge, then bumped over one unit, so it intersects poly1 but is not contained in it
    //  //dbo.collection('test').insert({ "loc" : poly2 })
    //  //dbo.collection('test').insert({ "loc" : poly3 })
    //  //dbo.collection('test').ensureIndex({ "loc" : "2dsphere" })


     
     
     
     
    //  dbo.collection('test').find({ "loc" : {
    //     "$geoIntersects" : {
    //         "$geometry" : poly1
    //     }
    // } }).toArray(function(err, result) {
    //     if (err) throw err;
    //     console.log('geointerescts ',result, '-=-=-=-', result[0].loc.coordinates)
    // })

    // // poly2 and poly3 returned
    //  dbo.collection('test').find({ "loc" : {
    //     "$geoWithin" : {
    //         "$geometry" : poly1
    //     }
    // } }).toArray(function(err, result) {
    //             if (err) throw err;
    //             console.log(' geowithin ',result, '-=-=-=-=-')
    // })
    // poly2 returned

});