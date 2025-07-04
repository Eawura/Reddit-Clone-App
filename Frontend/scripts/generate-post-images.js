const fs = require('fs');
const path = require('path');

// Post data from latest.jsx
const posts = [
  {
    id: '1',
    title: 'Just finished building my first React Native app! Here\'s what I learned',
    content: 'After 3 months of learning and building, I finally completed my first mobile app. The journey was incredible and I wanted to share some key insights...',
    subreddit: 'reactnative',
    imageName: 'react-native-app.jpg'
  },
  {
    id: '2',
    title: 'My cat just discovered the laser pointer for the first time',
    content: 'The pure joy and confusion on his face was priceless. I think I\'ve created a monster though - he won\'t stop looking for the red dot everywhere!',
    subreddit: 'aww',
    imageName: 'cat-laser-pointer.jpg'
  },
  {
    id: '3',
    title: 'Found this amazing coffee shop in downtown. Best latte I\'ve ever had!',
    content: 'Hidden gem alert! This place has the most incredible coffee and the atmosphere is perfect for working. Highly recommend checking it out.',
    subreddit: 'coffee',
    imageName: 'coffee-shop-latte.jpg'
  },
  {
    id: '4',
    title: 'Just got my dream job offer! After 6 months of job hunting',
    content: 'I can\'t believe it finally happened! The interview process was intense but totally worth it. For anyone struggling with job search - keep going!',
    subreddit: 'jobs',
    imageName: 'dream-job-offer.jpg'
  },
  {
    id: '5',
    title: 'My homemade pizza turned out perfect tonight',
    content: 'Been practicing my pizza-making skills for months. Tonight everything came together - perfect crust, sauce, and toppings. So satisfying!',
    subreddit: 'food',
    imageName: 'homemade-pizza.jpg'
  },
  {
    id: '6',
    title: 'Just finished reading "The Midnight Library" - absolutely mind-blowing',
    content: 'This book completely changed my perspective on life choices and regrets. Has anyone else read it? I need to discuss the ending!',
    subreddit: 'books',
    imageName: 'midnight-library-book.jpg'
  },
  {
    id: '7',
    title: 'My plant collection is finally complete! Here\'s my indoor jungle',
    content: 'After months of collecting and caring for these beauties, I think I\'ve reached the perfect balance. Each one has its own personality!',
    subreddit: 'houseplants',
    imageName: 'indoor-plant-jungle.jpg'
  },
  {
    id: '8',
    title: 'Just completed my first 10K run! Never thought I could do it',
    content: 'Started running 6 months ago and today I finally hit this milestone. The feeling of accomplishment is incredible. Next goal: half marathon!',
    subreddit: 'running',
    imageName: '10k-running-achievement.jpg'
  }
];

// Image specifications for post cards
const imageSpecs = {
  width: 400, // Base width for 100% scaling
  height: 300, // Fixed height as per styles
  aspectRatio: '4:3', // Good for post cards
  borderRadius: 12,
  format: 'jpg',
  quality: 'high'
};

// Generate image descriptions for AI image generation
const generateImageDescriptions = () => {
  const descriptions = posts.map(post => ({
    id: post.id,
    title: post.title,
    subreddit: post.subreddit,
    imageName: post.imageName,
    description: getImageDescription(post)
  }));
  
  return descriptions;
};

const getImageDescription = (post) => {
  const descriptions = {
    '1': 'A modern smartphone displaying a React Native app development interface with code editor, showing mobile app screens and development tools. Clean, professional tech aesthetic.',
    '2': 'A cute orange tabby cat looking curiously at a red laser dot on the floor, with wide eyes and alert ears. Warm lighting, cozy home environment.',
    '3': 'A beautifully crafted latte art coffee in a ceramic cup on a wooden table, with steam rising. Cozy coffee shop atmosphere with warm lighting and plants.',
    '4': 'A professional job offer letter or email on a laptop screen, with a celebratory glass of champagne or coffee nearby. Office or home workspace setting.',
    '5': 'A perfectly baked homemade pizza with golden crust, melted cheese, and fresh toppings. Close-up shot showing texture and detail. Kitchen counter background.',
    '6': 'The book "The Midnight Library" by Matt Haig on a cozy reading nook with warm lighting, maybe with a cup of tea and reading glasses nearby.',
    '7': 'A diverse collection of indoor plants in various pots and hanging planters, creating a lush green indoor jungle. Natural lighting, modern home decor.',
    '8': 'A runner crossing a finish line or celebrating with a medal, showing accomplishment and joy. Outdoor running environment, motivational atmosphere.'
  };
  
  return descriptions[post.id] || 'A relevant image for the post content';
};

// Generate the updated imageMap for latest.jsx
const generateImageMap = () => {
  const imageMapEntries = posts.map(post => 
    `  '${post.imageName}': require('../../assets/images/${post.imageName}'),`
  ).join('\n');
  
  return `// Updated imageMap for post images
const imageMap = {
  // Existing profile images
  'curry.jpg': require('../../assets/images/curry.jpg'),
  'Messi.jpg': require('../../assets/images/Messi.jpg'),
  'harry logo.webp': require('../../assets/images/harry logo.webp'),
  'Penguin.jpg': require('../../assets/images/Penguin.jpg'),
  'D.jpg': require('../../assets/images/D.jpg'),
  'K.jpg': require('../../assets/images/K.jpg'),
  'MB.jpg': require('../../assets/images/MB.jpg'),
  'N.webp': require('../../assets/images/N.webp'),
  'Ronaldo.jpg': require('../../assets/images/Ronaldo.jpg'),
  'SGA.jpg': require('../../assets/images/SGA.jpg'),
  'T1.jpg': require('../../assets/images/T1.jpg'),
  'w1.jpg': require('../../assets/images/w1.jpg'),
  'yu.jpg': require('../../assets/images/yu.jpg'),
  'Random.jpg': require('../../assets/images/Random.jpg'),
  'Grand.jpeg': require('../../assets/images/Grand.jpeg'),
  'Ramen.jpeg': require('../../assets/images/Ramen.jpeg'),
  'M8 bmw.jpg': require('../../assets/images/M8 bmw.jpg'),
  'euro\\'s league logo.jpg': require('../../assets/images/euro\\'s league logo.jpg'),
  'fifa logo.jpg': require('../../assets/images/fifa logo.jpg'),
  'Logo-NBA.png': require('../../assets/images/Logo-NBA.png'),
  'daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp': require('../../assets/images/daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp'),
  'danny-1.webp': require('../../assets/images/danny-1.webp'),
  
  // Post images
${imageMapEntries}
  
  // Commenter profile images
  'commenter1.jpg': require('../../assets/images/Commenter1.jpg'),
  'commenter2.jpg': require('../../assets/images/Commenter2.jpg'),
  'commenter3.jpg': require('../../assets/images/Commenter3.jpg'),
  'commenter4.jpg': require('../../assets/images/Commenter4.jpg'),
  'commenter5.jpg': require('../../assets/images/Commenter5.jpg'),
  'commenter6.jpg': require('../../assets/images/Commenter6.jpg'),
  'commenter7.jpg': require('../../assets/images/Commenter7.jpg'),
  'commenter8.jpg': require('../../assets/images/Commenter8.jpg'),
  'commenter9.jpg': require('../../assets/images/Commenter9.jpg'),
  'commenter10.jpg': require('../../assets/images/Commenter10.jpg'),
};`;
};

// Generate updated post data with local images
const generateUpdatedPostData = () => {
  return `const latestData = [
${posts.map(post => `    {
        id: '${post.id}',
        title: '${post.title}',
        content: '${post.content}',
        subreddit: '${post.subreddit}',
        author: '${getAuthor(post.subreddit)}',
        time: '${getTime(post.id)}',
        upvotes: ${getUpvotes(post.id)},
        comments: ${getComments(post.id)},
        upvoted: false,
        downvoted: false,
        image: '${post.imageName}'
    }`).join(',\n')}
];`;
};

const getAuthor = (subreddit) => {
  const authors = {
    'reactnative': 'dev_newbie',
    'aww': 'catlover42',
    'coffee': 'coffee_enthusiast',
    'jobs': 'jobseeker2024',
    'food': 'pizzamaster',
    'books': 'bookworm_reader',
    'houseplants': 'plant_parent',
    'running': 'runner_in_progress'
  };
  return authors[subreddit] || 'reddit_user';
};

const getTime = (id) => {
  const times = {
    '1': '5m',
    '2': '12m',
    '3': '18m',
    '4': '25m',
    '5': '32m',
    '6': '41m',
    '7': '48m',
    '8': '55m'
  };
  return times[id] || '1h';
};

const getUpvotes = (id) => {
  const upvotes = {
    '1': 23,
    '2': 156,
    '3': 89,
    '4': 234,
    '5': 445,
    '6': 78,
    '7': 567,
    '8': 189
  };
  return upvotes[id] || 100;
};

const getComments = (id) => {
  const comments = {
    '1': 8,
    '2': 23,
    '3': 15,
    '4': 67,
    '5': 89,
    '6': 34,
    '7': 123,
    '8': 45
  };
  return comments[id] || 20;
};

// Main execution
const main = () => {
  console.log('🎨 Generating Post Image Specifications for latest.jsx\n');
  
  console.log('📋 Image Specifications:');
  console.log(`- Dimensions: ${imageSpecs.width}x${imageSpecs.height}px`);
  console.log(`- Aspect Ratio: ${imageSpecs.aspectRatio}`);
  console.log(`- Format: ${imageSpecs.format.toUpperCase()}`);
  console.log(`- Quality: ${imageSpecs.quality}`);
  console.log(`- Border Radius: ${imageSpecs.borderRadius}px\n`);
  
  console.log('🖼️  Required Images:');
  const descriptions = generateImageDescriptions();
  descriptions.forEach(desc => {
    console.log(`\n${desc.id}. ${desc.imageName}`);
    console.log(`   Subreddit: r/${desc.subreddit}`);
    console.log(`   Description: ${desc.description}`);
  });
  
  console.log('\n📝 Generated Code:');
  console.log('\n// Updated imageMap:');
  console.log(generateImageMap());
  
  console.log('\n// Updated latestData:');
  console.log(generateUpdatedPostData());
  
  console.log('\n✅ Image generation specifications complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Create the 8 images using the descriptions above');
  console.log('2. Save them in assets/images/ with the specified names');
  console.log('3. Update the imageMap in latest.jsx');
  console.log('4. Update the latestData to use local image names');
};

if (require.main === module) {
  main();
}

module.exports = {
  posts,
  imageSpecs,
  generateImageDescriptions,
  generateImageMap,
  generateUpdatedPostData
}; 