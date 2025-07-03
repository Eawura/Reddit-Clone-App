# Post Card Images for latest.jsx

## Image Specifications
- **Dimensions**: 400x300px (16:9 aspect ratio works well)
- **Format**: JPG
- **Quality**: High
- **Border Radius**: 12px (handled by CSS)
- **File Location**: `assets/images/`

## Required Images

### 1. react-native-app.jpg
**Post**: "Just finished building my first React Native app! Here's what I learned"
**Subreddit**: r/reactnative
**Description**: A modern smartphone displaying a React Native app development interface with code editor, showing mobile app screens and development tools. Clean, professional tech aesthetic.

### 2. cat-laser-pointer.jpg
**Post**: "My cat just discovered the laser pointer for the first time"
**Subreddit**: r/aww
**Description**: A cute orange tabby cat looking curiously at a red laser dot on the floor, with wide eyes and alert ears. Warm lighting, cozy home environment.

### 3. coffee-shop-latte.jpg
**Post**: "Found this amazing coffee shop in downtown. Best latte I've ever had!"
**Subreddit**: r/coffee
**Description**: A beautifully crafted latte art coffee in a ceramic cup on a wooden table, with steam rising. Cozy coffee shop atmosphere with warm lighting and plants.

### 4. dream-job-offer.jpg
**Post**: "Just got my dream job offer! After 6 months of job hunting"
**Subreddit**: r/jobs
**Description**: A professional job offer letter or email on a laptop screen, with a celebratory glass of champagne or coffee nearby. Office or home workspace setting.

### 5. homemade-pizza.jpg
**Post**: "My homemade pizza turned out perfect tonight"
**Subreddit**: r/food
**Description**: A perfectly baked homemade pizza with golden crust, melted cheese, and fresh toppings. Close-up shot showing texture and detail. Kitchen counter background.

### 6. midnight-library-book.jpg
**Post**: "Just finished reading 'The Midnight Library' - absolutely mind-blowing"
**Subreddit**: r/books
**Description**: The book "The Midnight Library" by Matt Haig on a cozy reading nook with warm lighting, maybe with a cup of tea and reading glasses nearby.

### 7. indoor-plant-jungle.jpg
**Post**: "My plant collection is finally complete! Here's my indoor jungle"
**Subreddit**: r/houseplants
**Description**: A diverse collection of indoor plants in various pots and hanging planters, creating a lush green indoor jungle. Natural lighting, modern home decor.

### 8. 10k-running-achievement.jpg
**Post**: "Just completed my first 10K run! Never thought I could do it"
**Subreddit**: r/running
**Description**: A runner crossing a finish line or celebrating with a medal, showing accomplishment and joy. Outdoor running environment, motivational atmosphere.

## Implementation Steps

1. **Generate Images**: Create the 8 images using AI image generation tools (like DALL-E, Midjourney, or Stable Diffusion) with the descriptions above
2. **Save Images**: Place all images in the `assets/images/` folder
3. **Update imageMap**: Add the new images to the imageMap in latest.jsx
4. **Update Post Data**: Replace the Unsplash URLs with local image names

## Updated imageMap Code

```javascript
const imageMap = {
  // Existing profile images...
  
  // Post images
  'react-native-app.jpg': require('../../assets/images/react-native-app.jpg'),
  'cat-laser-pointer.jpg': require('../../assets/images/cat-laser-pointer.jpg'),
  'coffee-shop-latte.jpg': require('../../assets/images/coffee-shop-latte.jpg'),
  'dream-job-offer.jpg': require('../../assets/images/dream-job-offer.jpg'),
  'homemade-pizza.jpg': require('../../assets/images/homemade-pizza.jpg'),
  'midnight-library-book.jpg': require('../../assets/images/midnight-library-book.jpg'),
  'indoor-plant-jungle.jpg': require('../../assets/images/indoor-plant-jungle.jpg'),
  '10k-running-achievement.jpg': require('../../assets/images/10k-running-achievement.jpg'),
  
  // Existing commenter images...
};
```

## Updated Post Data

Replace the `image` field in each post from Unsplash URLs to local image names:

```javascript
{
  id: '1',
  title: 'Just finished building my first React Native app! Here\'s what I learned',
  // ... other fields
  image: 'react-native-app.jpg' // Instead of Unsplash URL
}
```

## Design Considerations

- **Consistent Style**: All images should have a similar aesthetic and quality
- **Good Lighting**: Ensure images are well-lit and clear
- **Relevant Content**: Images should directly relate to the post content
- **Professional Quality**: High-resolution images that look good on mobile devices
- **Color Harmony**: Images should work well with both light and dark themes 