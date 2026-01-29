// Category
import fruitCategory from '@/assets/Category/fruitCategory.svg'
import vegeCategory from '@/assets/Category/vegeCategory.svg'
import meatCategory from '@/assets/Category/meatCategory.svg'
import snackCategory from '@/assets/Category/snackCategory.svg'
import bevrageCategory from '@/assets/Category/bevrageCategory.svg'
import breadCategory from '@/assets/Category/breadCategory.svg'
import needsCategory from '@/assets/Category/needsCategory.svg'
import cookCategory from '@/assets/Category/cookCategory.svg'
import beauty from '@/assets/Category/beauty.svg'
import oils from '@/assets/Category/oils.svg'
import diabitic from '@/assets/Category/diabitic.svg'
import dishwash from '@/assets/Category/dishwash.svg'

// Category banner
import fruits_category_banner from '@/assets/Category_banner/fruits.jpg'
import vegetable_category_banner from '@/assets/Category_banner/vegetable.jpg'
import meat_fish_category_banner from '@/assets/Category_banner/meat_egg_fish.jpg'
import snacks_category_banner from '@/assets/Category_banner/snacks.jpg'
import bevrages_category_banner from '@/assets/Category_banner/bevrages.jpg'
import backery_category_banner from '@/assets/Category_banner/backery.jpg'
import baking_needs_category_banner from '@/assets/Category_banner/baking_needs.jpg'
import cooking_category_banner from '@/assets/Category_banner/cooking.jpg'
import beauty_health_category_banner from '@/assets/Category_banner/beauty_health.jpg'
import oils_category_banner from '@/assets/Category_banner/oils.jpg'
import diabetic_food_category_banner from '@/assets/Category_banner/diabetic_food.jpg'
import dishwash_category_banner from '@/assets/Category_banner/dishwash.jpg'

// Centralize all category metadata(All information about each category in one object)
export const categoies = [
    { id: 1,  title: 'Fresh Fruits',      slug: 'fresh-fruits',       icon: fruitCategory,   banner: fruits_category_banner       },
    { id: 2,  title: 'Fresh Vegetables',  slug: 'fresh-vegetables',   icon: vegeCategory,    banner: vegetable_category_banner    },
    { id: 3,  title: 'Meat & Fish',       slug: 'meat-and-fish',      icon: meatCategory,    banner: meat_fish_category_banner    },
    { id: 4,  title: 'Snacks',            slug: 'snacks',             icon: snackCategory,   banner: snacks_category_banner       },
    { id: 5,  title: 'Beverages',         slug: 'beverages',          icon: bevrageCategory, banner: bevrages_category_banner     },
    { id: 6,  title: 'Bread Bakery',      slug: 'bread-bakery',       icon: breadCategory,   banner: backery_category_banner      },
    { id: 7,  title: 'Baking Needs',      slug: 'baking-needs',       icon: needsCategory,   banner: baking_needs_category_banner },
    { id: 8,  title: 'Cooking',           slug: 'cooking',            icon: cookCategory,    banner: cooking_category_banner      },
    { id: 9,  title: 'Beauty & Health',   slug: 'beauty-and-health',  icon: beauty,          banner: beauty_health_category_banner},
    { id: 10, title: 'Oils',              slug: 'oils',               icon: oils,            banner: oils_category_banner         },
    { id: 11, title: 'Diabitic Food',     slug: 'diabitic-food',      icon: diabitic,        banner: diabetic_food_category_banner},
    { id: 12, title: 'Dishwash',          slug: 'dishwash',           icon: dishwash,        banner: dishwash_category_banner     },
];

export const getCategoryBySlug = (slug) => {
    return categoies.find(category => category.slug === slug) || null;
}

export const getCategoryByTitle = (title) => {
    return categoies.find(category => category.title === title) || null;
}

export const titleToSlug = (title) => {
    return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/&/g, 'and');
}