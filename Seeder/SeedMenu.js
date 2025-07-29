// scripts/seedMenu.js
// Run with: node scripts/seedMenu.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CafeteriaMenu from '../models/CafeteriaMenu.model.js';

dotenv.config();

const sampleMenus = [
  {
    day: 'Monday',
    breakfast: [
      { name: 'Manakish Zaatar', protein: 8, calories: 280, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc7xbtURhtz8h-eugMxlGImDtRHsREBYMVRQ&s'},
      { name: 'Labneh with Olive Oil', protein: 10, calories: 200, image: 'https://www.simplyleb.com/wp-content/uploads/labneh_yogurt-3.jpg' }
    ],
    lunch: [
      { name: 'Chicken Tawook Wrap', protein: 25, calories: 450, image: 'https://lebeirut.lk/wp-content/uploads/2024/09/ultimate.jpg' },
      { name: 'Fattoush Salad', protein: 5, calories: 180, image: 'https://walkingthroughlavenderfields.com/wp-content/uploads/2022/10/fattoush-01.jpeg' }
    ],
    dessert: [
      { name: 'Knafeh', protein: 14, calories: 500, image: 'https://i.pinimg.com/600x315/0a/76/94/0a76948174fd999a0af600c2078cfa66.jpg' }
    ]
  },
  {
    day: 'Tuesday',
    breakfast: [
      {
        name: 'Manouche Jebne and Zaatar',
        protein: 15,
        calories: 500,
        image: 'https://lamanouchelibanaise.wordpress.com/wp-content/uploads/2019/04/whatsapp-image-2019-04-15-at-13.23.44-2.jpeg'
      },
      {
        name: 'Manouche Jebne Harra',
        protein: 15,
        calories: 580,
        image: 'https://ik.imagekit.io/misterd/tr:w-500,q-90/photo/_3jv0mfjjxi7tqxe_1708511372819_jebne%20harra.png'
      }
    ],
    lunch: [
      {
        name: 'Beef Shawarma Sandwich',
        protein: 30,
        calories: 500,
        image: 'https://amiraspantry.com/wp-content/uploads/2020/11/beef-shawarma-recipe-IG.jpg'
      },
      {
        name: 'Tabbouleh Salad',
        protein: 4,
        calories: 170,
        image: 'https://www.icookstuff.com/posts/450/images/0.jpg'
      }
    ],
    dessert: [
      {
        name: 'Maamoul Cookies',
        protein: 3,
        calories: 150,
        image: 'https://veredguttman.com/wp-content/uploads/2020/12/Date-maamoul.jpg'
      }
    ]
  },
  {
    day: 'Wednesday',
    breakfast: [
      {
        name: 'Croissant',
        protein: 5,
        calories: 260,
        image: 'https://en.julskitchen.com/wp-content/uploads/sites/2/2013/05/Italian-croissants-15.jpg'
      },
      {
        name: 'Pain Au Chocolat',
        protein: 4,
        calories: 150,
        image: 'https://images.immediate.co.uk/production/volatile/sites/30/2024/06/PainAuChoc-0ff983a.jpg'
      },
      {
        name: 'Manouche Jebne',
        protein: 15,
        calories: 550,
        image: 'https://lebanoninapicture.com/pages/good-morning-lebanon-from-kobayat-rodny-s/insta_10-11-2016-8-10-47-am-m.jpg'
      }
    ],
    lunch: [
      {
        name: 'Mansaf',
        protein: 20,
        calories: 400,
        image: 'https://butfirstchai.com/wp-content/uploads/2023/06/jordanian-mansaf-recipe.jpg'
      },
      {
        name: 'Fattoush Salad',
        protein: 5,
        calories: 180,
        image: 'https://walkingthroughlavenderfields.com/wp-content/uploads/2022/10/fattoush-01.jpeg'
      }
    ],
    dessert: [
      {
        name: 'Maamoul Cookies',
        protein: 3,
        calories: 150,
        image: 'https://veredguttman.com/wp-content/uploads/2020/12/Date-maamoul.jpg'
      }
    ]
  },
  {
    day: 'Thursday',
    breakfast: [
      {
        name: 'Waffles with syrup',
        protein: 12,
        calories: 300,
        image: 'https://www.musselmans.com/wp-content/uploads/abwcs-580x435.jpg'
      },
      {
        name: 'Manakish Zaatar',
        protein: 8,
        calories: 280,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc7xbtURhtz8h-eugMxlGImDtRHsREBYMVRQ&s'
      },
      {
        name: 'Manouche Jebne',
        protein: 15,
        calories: 550,
        image: 'https://lebanoninapicture.com/pages/good-morning-lebanon-from-kobayat-rodny-s/insta_10-11-2016-8-10-47-am-m.jpg'
      }
    ],
    lunch: [
      {
        name: 'Chicken Shawarma Sandwich',
        protein: 25,
        calories: 450,
        image: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2022/11/08/DV3607-fattoush-chicken-shawarma-wrap-shawarma-guys-san-diego-california_s4x3.JPG.rend.hgtvcom.1280.1280.suffix/1667937205404.webp'
      },
      {
        name: 'Fattoush Salad',
        protein: 5,
        calories: 180,
        image: 'https://walkingthroughlavenderfields.com/wp-content/uploads/2022/10/fattoush-01.jpeg'
      }
    ],
    dessert: [
      {
        name: 'Lazy Cake',
        protein: 4,
        calories: 320,
        image: 'https://thecookingfoodie.com/wp-content/uploads/2024/08/240872_d1-jpg.jpg'
      }
    ]
  },
  {
    day: 'Friday',
    breakfast: [
      {
        name: 'Manouche Jebne',
        protein: 15,
        calories: 550,
        image: 'https://lebanoninapicture.com/pages/good-morning-lebanon-from-kobayat-rodny-s/insta_10-11-2016-8-10-47-am-m.jpg'
      },
      {
        name: 'Manouche Zaatar',
        protein: 8,
        calories: 280,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc7xbtURhtz8h-eugMxlGImDtRHsREBYMVRQ&s'
      },
      {
        name: 'Manouche Jebne Harra',
        protein: 15,
        calories: 580,
        image: 'https://ik.imagekit.io/misterd/tr:w-500,q-90/photo/_3jv0mfjjxi7tqxe_1708511372819_jebne%20harra.png'
      }
    ],
    lunch: [
      {
        name: 'Hamburger',
        protein: 28,
        calories: 650,
        image: 'https://recipe-graphics.grocerywebsite.com/0_GraphicsRecipes/4589_4k.jpg'
      },
      {
        name: 'Hot dog Sandwich',
        protein: 20,
        calories: 480,
        image: 'https://www.allrecipes.com/thmb/8M8hZ2LX1w-XTOh5HJBv-9019RQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/244669-blt-dogs-VAT-005-step-04-1-5571c562383e439fbb65be15e15cca01.jpg'
      },
      {
        name: 'Tabbouleh Salad',
        protein: 4,
        calories: 170,
        image: 'https://www.icookstuff.com/posts/450/images/0.jpg'
      }
    ],
    dessert: [
      {
        name: 'Foret Noir Cake',
        protein: 3,
        calories: 300,
        image: 'https://new.secretscakes.com/files/width/600/height/600/crop/600x600x0/images/content-images/cakes/foret-noir-8-10-pers.jpg'
      }
    ]
  }
];


async function seed() {
  try {
    await mongoose.connect("");
    console.log('Connected to DB');

    // Clear existing menus
    await CafeteriaMenu.deleteMany({});
    console.log('Cleared existing menus');

    // Insert sample menus
    await CafeteriaMenu.insertMany(sampleMenus);
    console.log('Inserted sample menus for Monday through Friday');

    await mongoose.disconnect();
    console.log('Disconnected from DB');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();