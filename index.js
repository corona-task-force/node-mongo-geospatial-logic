var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

var url = process.env.mongoURL || "mongodb://localhost:27017/";
var express = require('express');
var cors = require('cors') 
var bodyParser = require('body-parser')
var app = express();

var fs = require('fs');
/**LOAD LINESTRING GEOJSON */
var BNO = require('./bostonNewOrleans.json')
console.log(BNO, 'BNO', BNO.features[0].geometry)

var CMI = require('./chicagoMiami.json')
console.log(CMI, 'CMI', CMI.features[0].geometry)

var LAS = require('./lasVegasPheonix.json')
console.log(LAS, 'LAS', LAS.features[0].geometry)

var SEA = require('./seattleColorado.json')
console.log(SEA, 'SEA', SEA.features[0].geometry)

var AUS = require('./austinCharlotte.json')
console.log(AUS, 'AUS', AUS.features[0].geometry)

var BSH = require('./burgersShakes.json')
console.log(BSH, 'BSH', BSH.features[0].geometry)


var WAS = require('./washingtonHeights.json')
console.log(WAS, 'WAS', WAS.features[0].geometry)
var DEL = require('./delancey.json')
console.log(DEL, 'DEL', DEL.features[0].geometry)


var BOG = require('./bogota.json')
console.log(BOG, 'BOG', BOG.features[0].geometry)
var COL = require('./columbia.json')
console.log(COL, 'COL', COL.features[0].geometry)



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



MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    //dbo = db.db("ironrest");
    dbo = db.db("CORONA");

    console.log(url)

    url = `mongodb+srv://niko:nikoniko@cluster0-k13bi.mongodb.net/test?retryWrites=true&w=majority`
console.log(url)
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    //dbo = db.db("ironrest");
    dbc = db.db("ironrest");
    
    


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

    let w = COL.features[0].geometry.coordinates.map(eachCoord => {
        return {
            name: `${COL.name} : ${JSON.stringify(eachCoord)}`,
            location: { type: "Point", coordinates: eachCoord },
            person: 'Niko'
        }
    })

    let d = BOG.features[0].geometry.coordinates.map(eachCoord => {
        return {
            name: `${BOG.name} : ${JSON.stringify(eachCoord)}`,
            location: { type: "Point", coordinates: eachCoord },
            person: 'Sherwin'
        }
    })

    //dbo.collection('loc').insert(w).then(res => console.log('panda',res)).catch(err=>console.log('iguana',err))
    //dbo.collection('loc').insert(d).then(res => console.log('panda',res)).catch(err=>console.log('iguana',err))


    
    console.log(w,'w',d,'d')

    const promises = []


    dbo.collection('loc').find({person:"Niko"}).toArray(function(err, result) {
            if (err) throw err
            //console.log('geointerescts ',result.length,'-=-=-=-')
            result.forEach(function(spot){
                //console.log('spotty', spot.location.coordinates)
                 promises.push(
                    new Promise(resolve => {
                    dbo.collection('loc').find(
                    { person: 'Sherwin',
                      location:
                        { $near:
                           {
                             $geometry: { type: "Point",  coordinates: spot.location.coordinates },
                             $minDistance: 0,
                             $maxDistance: 5
                           }
                        }
                    }
                 ).toArray(function(err, matches){
                     if(err) throw err
                     //console.log('now', matches.length)
                     //if(matches.length > 0){
                     resolve(matches)
                     //}
                        //intersections.push(matches)
                      
                 })
                })
                )

            })
            Promise.all(promises).then(res => {
                console.log(res, 'lol')
                const collisions = []
                res.forEach(r => {
                    if(r.length > 0){
                        console.log(r, 'yikes')
                        // {lat: 52.511, lng: 13.447},
                        // {lat: 52.549, lng: 13.422},
                        // {lat: 52.497, lng: 13.396},
                        // {lat: 52.517, lng: 13.394}
                        collisions.push(r)

                    }
                })
                console.log(collisions.length)
                foundCollisions(collisions)
            }).catch(err => console.error(err))
   
    })    



    function foundCollisions(collisions){
        let allCollisions = collisions.flat(Infinity)
        console.log(allCollisions)
        let newArr = []
        allCollisions.forEach(c => { 
            console.log(c.location.coordinates)
            newArr.push({lat:c.location.coordinates[1], lng:c.location.coordinates[0]})
        })
        console.log(newArr)
        var json = JSON.stringify(newArr);
        fs.writeFile('myjsonfile.js', json, 'utf8', function(err,doc){console.log(err,doc)});

    }


    // dbo.collection('loc').find(
    //     {
    //       location:
    //         { $near:
    //            {
    //              $geometry: { type: "Point",  coordinates: [ -73.9667, 40.78 ] },
    //              $minDistance: 1000,
    //              $maxDistance: 5000
    //            }
    //         }
    //     }
    //  ).toArray(matches => console.log(matches, '=-=-=-='))
     

    // name: "Central Park",
    // location: { type: "Point", coordinates: [ -73.97, 40.77 ] },
    // category: "Parks"



    //  var poly1 = { "type" : "Polygon", "coordinates" : [[[0, 0], [3, 0], [0, 3], [0, 0]]] }




    dbo.collection('loc').find().toArray(function(err, res){
        if( err ) throw err
        // console.log(res, '-=-=-')
    })  


    dbc.collection('corona').find({}).toArray(function(err, herokuCorona) {
        if (err) throw err;
        // console.log(herokuCorona, 'corona')



        //{ "type": "LineString", "coordinates": [ [ -80.12094, 25.85966, 0.0 ], [ -80.12093, 25.85957, 0.0 ], [ -80.12088, 25.85845, 0.0 ], [ -80.12086, 25.8582
        let mySteps = []
        
        herokuCorona.forEach(eachStep => {
            // console.log(eachStep)
            if(eachStep.locations){
                if(isNaN(eachStep.locations[0].coords.longitude) || isNaN(eachStep.locations[0].coords.latitude)){
                    console.log('NOT A NUMBER!', eachStep.locations[0].coords.longitude, eachStep.locations[0].coords.latitude)
                }
                mySteps.push( [parseFloat(eachStep.locations[0].coords.longitude), parseFloat(eachStep.locations[0].coords.latitude)] )
            }
        })

        

        // console.log(mySteps, 'mySteps')

        let obj = {
            Name: 'Me WAlking around ',
            type: 'LineString',
            coordinates: mySteps
        }
        // console.log(CMI.features[0].geometry, 'between' ,obj)


        // CMI
        // ole
        
        // LAS
        // ole
        
        // SEA
        // ole
        
        // AUS
        // ole
        
        // BSH


        //dbo.collection('loc').insert({ "loc" :   CMI.features[0].geometry }).then(res => console.log('panda',res)).catch(err=>console.log('iguana',err))
        // dbo.collection('loc').insert({ "loc" :   BNO.features[0].geometry }).then(res => console.log('panda',res)).catch(err=>console.log('iguana',err))
        // dbo.collection('loc').insert({ "loc" :   LAS.features[0].geometry }).then(res => console.log('panda',res)).catch(err=>console.log('iguana',err))
        // dbo.collection('loc').insert({ "loc" :   SEA.features[0].geometry }).then(res => console.log('panda',res)).catch(err=>console.log('iguana',err))
        // dbo.collection('loc').insert({ "loc" :   AUS.features[0].geometry }).then(res => console.log('panda',res)).catch(err=>console.log('iguana',err))
        // dbo.collection('loc').insert({ "loc" :   BSH.features[0].geometry }).then(res => console.log('panda',res)).catch(err=>console.log('iguana',err))

        //dbo.collection('loc').insert({ "loc" :  obj }).then(res => console.log('panda',res)).catch(err=>console.log('iguana',err))
        // console.log(loc1)
        // dbo.collection('loc').find({ "loc" : {
        //     "$geoIntersects" : {
        //         "$geometry" : BNO.features[0].geometry //obj
        //     }   
        // } }).toArray(function(err, result) {
        //     if (err) throw err
        //     console.log('geointerescts ',result, obj.Name,'-=-=-=-')
        // })
    //    dbo.collection('loc').createIndex({"loc.coordinates": "2dsphere"})

        // dbo.collection('loc').getIndexes().then(res => {
        //     console.log('index', res)
        // }).catch(err => console.log('err',err))
        // dbo.collection('loc').find({
        //     loc:{
        //          $nearSphere:{
        //                $geometry:{
        //                     type:"Point", 
        //                     coordinates:[-2.551010, 48.59123]
        //                }, 
        //                $maxDistance:2000
        //          } 
        //     }
        // }).toArray(function(err, result) {
        //         if (err) throw err
        //         console.log('geointerescts ',result, obj.Name,'-=-=-=-')
        // })
        // dbo.collection('loc').find( {
        //     "loc": { $near: [ -74 , 40 ],  $maxDistance: 10 }
        // } ).toArray(function(err, result) {
        //     if (err) throw err
        //     console.log('geointerescts ',result, obj.Name,'-=-=-=-')
        // })     

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

});