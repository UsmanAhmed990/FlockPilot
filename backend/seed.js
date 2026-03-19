// const mongoose = require('mongoose');
// const User = require('./models/User');
// const Chef = require('./models/Chef');
// const Food = require('./models/Food');
// require('dotenv').config();

// const seedData = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log('MongoDB Connected for seeding...');

//         // Clear existing data
//         await Food.deleteMany({});
//         await Chef.deleteMany({});
//         await User.deleteMany({});
//         console.log('Cleared existing data');

//         // Create Chef Users
//         const chefUsers = await User.create([
//             {
//                 name: 'Chef Fatima',
//                 email: 'fatima@chef.com',
//                 password: '$2a$10$YourHashedPasswordHere',
//                 role: 'chef',
//                 address: { city: 'Karachi', street: 'Gulshan-e-Iqbal', zip: '75300' }
//             },
//             {
//                 name: 'Chef Ahmed',
//                 email: 'ahmed@chef.com',
//                 password: '$2a$10$YourHashedPasswordHere',
//                 role: 'chef',
//                 address: { city: 'Lahore', street: 'DHA Phase 5', zip: '54000' }
//             },
//             {
//                 name: 'Chef Ayesha',
//                 email: 'ayesha@chef.com',
//                 password: '$2a$10$YourHashedPasswordHere',
//                 role: 'chef',
//                 address: { city: 'Islamabad', street: 'F-7 Markaz', zip: '44000' }
//             }
//         ]);
//         console.log('Created chef users');

//         // Create Chef Profiles
//         const chefs = await Chef.create([
//             { user: chefUsers[0]._id, bio: 'Specialist in traditional Karachi biryani', specialties: 'Biryani, Karahi', isApproved: true },
//             { user: chefUsers[1]._id, bio: 'Expert in Lahori cuisine and BBQ', specialties: 'BBQ, Pulao', isApproved: true },
//             { user: chefUsers[2]._id, bio: 'Healthy desi food and diet plans', specialties: 'Diet Food, Breakfast', isApproved: true }
//         ]);
//         console.log('Created chef profiles');

//         // Create Food Items
//         const foods = [
//             // BREAKFAST
//             {
//                 chef: chefs[2]._id,
//                 name: 'Halwa Puri',
//                 description: 'Traditional Pakistani breakfast with halwa, puri, and channay',
//                 price: 250,
//                 images: ['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500'],
//                 category: 'Breakfast',
//                 dietType: 'Regular',
//                 available: true
//             },
//             {
//                 chef: chefs[2]._id,
//                 name: 'Paratha with Omelette',
//                 description: 'Crispy paratha served with spicy omelette',
//                 price: 180,
//                 images: ['https://images.unsplash.com/photo-1630383249896-424e482df921?w=500'],
//                 category: 'Breakfast',
//                 dietType: 'Regular',
//                 available: true
//             },
//             {
//                 chef: chefs[2]._id,
//                 name: 'Healthy Oats Bowl',
//                 description: 'Nutritious oats with fruits and nuts',
//                 price: 220,
//                 images: ['https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500'],
//                 category: 'Breakfast',
//                 dietType: 'Diabetic',
//                 available: true
//             },

//             // LUNCH - BIRYANI & RICE
//             {
//                 chef: chefs[0]._id,
//                 name: 'Chicken Biryani',
//                 description: 'Authentic Karachi-style chicken biryani with raita',
//                 price: 450,
//                 images: ['https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500'],
//                 category: 'Lunch',
//                 dietType: 'Regular',
//                 available: true
//             },
//             {
//                 chef: chefs[0]._id,
//                 name: 'Mutton Biryani',
//                 description: 'Aromatic mutton biryani with tender meat',
//                 price: 650,
//                 images: ['https://images.unsplash.com/photo-1642821373181-696a54913e93?w=500'],
//                 category: 'Lunch',
//                 dietType: 'Desi',
//                 available: true
//             },
//             {
//                 chef: chefs[1]._id,
//                 name: 'Chicken Pulao',
//                 description: 'Fragrant chicken pulao with yogurt',
//                 price: 400,
//                 images: ['https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500'],
//                 category: 'Lunch',
//                 dietType: 'Regular',
//                 available: true
//             },
//             {
//                 chef: chefs[1]._id,
//                 name: 'Vegetable Pulao',
//                 description: 'Healthy vegetable pulao with mixed veggies',
//                 price: 300,
//                 images: ['https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=500'],
//                 category: 'Lunch',
//                 dietType: 'Vegan',
//                 available: true
//             },

//             // LUNCH - KARAHI & CURRY
//             {
//                 chef: chefs[0]._id,
//                 name: 'Chicken Karahi',
//                 description: 'Spicy chicken karahi with fresh tomatoes',
//                 price: 550,
//                 images: ['https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500'],
//                 category: 'Lunch',
//                 dietType: 'Desi',
//                 available: true
//             },
//             {
//                 chef: chefs[0]._id,
//                 name: 'Mutton Karahi',
//                 description: 'Traditional mutton karahi with green chilies',
//                 price: 750,
//                 images: ['https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'],
//                 category: 'Lunch',
//                 dietType: 'Desi',
//                 available: true
//             },
//             {
//                 chef: chefs[2]._id,
//                 name: 'Chicken Korma',
//                 description: 'Creamy chicken korma with mild spices',
//                 price: 500,
//                 images: ['https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500'],
//                 category: 'Lunch',
//                 dietType: 'Regular',
//                 available: true
//             },

//             // DINNER - BBQ & GRILLED
//             {
//                 chef: chefs[1]._id,
//                 name: 'Chicken Tikka',
//                 description: 'Grilled chicken tikka with mint chutney',
//                 price: 480,
//                 images: ['https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500'],
//                 category: 'Dinner',
//                 dietType: 'Keto',
//                 available: true
//             },
//             {
//                 chef: chefs[1]._id,
//                 name: 'Seekh Kabab',
//                 description: 'Juicy seekh kababs with naan',
//                 price: 520,
//                 images: ['https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500'],
//                 category: 'Dinner',
//                 dietType: 'Regular',
//                 available: true
//             },
//             {
//                 chef: chefs[1]._id,
//                 name: 'Malai Boti',
//                 description: 'Creamy malai boti with special marinade',
//                 price: 550,
//                 images: ['https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500'],
//                 category: 'Dinner',
//                 dietType: 'Regular',
//                 available: true
//             },
//             {
//                 chef: chefs[1]._id,
//                 name: 'Reshmi Kabab',
//                 description: 'Soft and tender reshmi kabab',
//                 price: 500,
//                 images: ['https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500'],
//                 category: 'Dinner',
//                 dietType: 'Keto',
//                 available: true
//             },

//             // DINNER - SPECIAL DISHES
//             {
//                 chef: chefs[0]._id,
//                 name: 'Nihari',
//                 description: 'Slow-cooked beef nihari with naan',
//                 price: 600,
//                 images: ['https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'],
//                 category: 'Dinner',
//                 dietType: 'Desi',
//                 available: true
//             },
//             {
//                 chef: chefs[0]._id,
//                 name: 'Haleem',
//                 description: 'Traditional haleem with lemon and ginger',
//                 price: 450,
//                 images: ['https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'],
//                 category: 'Dinner',
//                 dietType: 'Regular',
//                 available: true
//             },
//             {
//                 chef: chefs[2]._id,
//                 name: 'Grilled Fish',
//                 description: 'Healthy grilled fish with vegetables',
//                 price: 700,
//                 images: ['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500'],
//                 category: 'Dinner',
//                 dietType: 'Diabetic',
//                 available: true
//             },
//             {
//                 chef: chefs[2]._id,
//                 name: 'Daal Chawal',
//                 description: 'Comfort food - yellow daal with rice',
//                 price: 250,
//                 images: ['https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500'],
//                 category: 'Dinner',
//                 dietType: 'Vegan',
//                 available: true
//             }
//         ];

//         await Food.create(foods);
//         console.log(`✅ Created ${foods.length} food items`);

//         console.log('\n🎉 Database seeded successfully!');
//         console.log(`📊 Summary:`);
//         console.log(`   - ${chefUsers.length} Chefs created`);
//         console.log(`   - ${foods.length} Food items added`);
//         console.log(`   - Categories: Breakfast, Lunch, Dinner`);
//         console.log(`   - Diet Types: Regular, Keto, Diabetic, Vegan, Desi`);

//         process.exit(0);
//     } catch (error) {
//         console.error('❌ Error seeding database:', error);
//         process.exit(1);
//     }
// };

// seedData();
