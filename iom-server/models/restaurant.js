const mongoose = require('mongoose');
const dotenv = require('dotenv');
const _ = require('lodash');

// loads the local .env file into process.env
dotenv.config();

// connecting to the mongoDB
const dburi = process.env.dbURI;
const secret = process.env.secret;

mongoose.connect(dburi, { useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("connected to IOM DB"))
    .catch((err) => console.log(err));



// restaurant details schema
const restaurantDetailsSchema = new mongoose.Schema({
    
    restaurantData: [
        {
            name: {
                required: true,
                type: String
            },
            location: {
                required:true,
                type: String
            }
        }
    ],    
});


// restaurant owner schema
const restaurantOwnerSchema = new mongoose.Schema({
   
    ownerEmail: {
        type:String,
        required: true,
    },

    restaurantDetails: restaurantDetailsSchema
});



// restaurant details model
const restaurantDetailModel = new mongoose.model('RestaurantDetails',restaurantDetailsSchema);

// console.log(restaurantDetailModel)

// restaurant owner model
const restaurantOwnerModel = new mongoose.model('RestaurantOwner',restaurantOwnerSchema);


// add a restaurant
async function addRestaurant(data){

    const restaurant = new restaurantDetailModel({
            restaurantData: [
                {
                    $push : {
                        name: "Ande ka finda",
                        location: "bangalore"
                    },
                    $upsert: true        
                }
            ]
        });

    await restaurant.save();

    console.log(restaurant);

    const restaurantOwner = new restaurantOwnerModel({
        ownerEmail: data.email,
        restaurantDetails : restaurant
    });
    await restaurantOwner.save();

    return(restaurantOwner)



        // .then(async function(){

        //     const restaurantOwner = new restaurantOwnerModel({
        //         ownerEmail: data.email,
        //         restaurant
        
        //     });
        //     const data = await restaurantOwner.save()
        //     console.log(data);
        // })
        // // .then((data) => { return (_.pick(data,[
        // //     'name','location','ownerEmail']
        // //     ))}
        // // )
        // .catch((err) => console.log(err));

    // console.log(restaurantName,restaurantLocation,email);

    

};

// // get all restaurants
// async function getRestaurant(email){
//     const restaurantList = await restaurantModel
//         .find({ownerEmail:email})
//         .select({name:1,location:1})
    
//     return restaurantList;
    
// };


// // update a restaurant
async function updateRestaurant(name,location,oldEmail,newEmail) {

    if(newEmail === ""){
        newEmail = oldEmail
    }
    const restaurant_details = {name:name,location:location};

    query = {ownerEmail:oldEmail}

    const restaurant = await restaurantModel
        .findOneAndUpdate(

            query,

            {$push : {

                restaurantData :[restaurant_details]
            }
        },
        {
            upsert: true
        },
        function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Added succesfully")
            }
        }
        );
        console.log(restaurant);
    
        return(_.pick(await restaurant,['name','location','ownerEmail']));
};


// // delete a restaurant
// async function deleteRestaurant(name,location,email){
//     const restaurant = await restaurantModel
//         .findAndModify({
//             query : {name: name,location:location,ownerEmail:email},

//             remove: true
//         });
    
//     return "Restaurant data deleted"
// };


module.exports = {addRestaurant,restaurantDetailModel,updateRestaurant}
