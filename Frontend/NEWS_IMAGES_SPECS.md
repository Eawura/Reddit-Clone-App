# News Images for news.jsx

## Image Specifications
- **Dimensions**: 400x300px (16:9 aspect ratio)
- **Format**: JPG
- **Quality**: High
- **Border Radius**: 12px (handled by CSS)
- **File Location**: `assets/images/`

## Required Images

### 1. ai-breakthrough-tech.jpg
**News**: "Breaking: Major Tech Company Announces Revolutionary AI Breakthrough"
**Category**: Technology
**Description**: Futuristic AI interface with neural networks, holographic displays, blue/white tech aesthetic

### 2. underdog-championship-sports.jpg
**News**: "Sports: Underdog Team Makes Historic Victory in Championship Game"
**Category**: Sports
**Description**: Dramatic sports celebration with confetti, trophy, vibrant colors, emotional energy

### 3. exercise-study-science.jpg
**News**: "Science: New Study Reveals Surprising Benefits of Daily Exercise"
**Category**: Science
**Description**: Scientific laboratory with charts, fitness equipment, clean research environment

### 4. director-blockbuster-entertainment.jpg
**News**: "Entertainment: Award-Winning Director Announces New Blockbuster Project"
**Category**: Entertainment
**Description**: Film director on set with camera equipment, movie clapperboard, Hollywood glamour

### 5. global-markets-business.jpg
**News**: "Business: Global Markets React to New Economic Policy Changes"
**Category**: Business
**Description**: Financial charts, stock market displays, business professionals in suits

### 6. climate-legislation-politics.jpg
**News**: "Politics: New Legislation Aims to Address Climate Change Concerns"
**Category**: Politics
**Description**: Government building, politicians, environmental symbols like trees

### 7. cancer-treatment-health.jpg
**News**: "Health: Breakthrough in Cancer Treatment Shows Promising Results"
**Category**: Health
**Description**: Medical laboratory with microscopes, healthcare professionals in white coats

### 8. quantum-computing-technology.jpg
**News**: "Technology: Quantum Computing Milestone Achieved by Research Team"
**Category**: Technology
**Description**: Advanced quantum computing equipment with complex circuitry, futuristic technology

## Implementation Steps

1. Generate the 8 images using AI tools with the descriptions above
2. Save images in `assets/images/` folder
3. Update imageMap in news.jsx
4. Update news data to use new image names

## Updated imageMap

```javascript
const imageMap = {
  // Existing images...
  
  // News images
  'ai-breakthrough-tech.jpg': require('../../assets/images/ai-breakthrough-tech.jpg'),
  'underdog-championship-sports.jpg': require('../../assets/images/underdog-championship-sports.jpg'),
  'exercise-study-science.jpg': require('../../assets/images/exercise-study-science.jpg'),
  'director-blockbuster-entertainment.jpg': require('../../assets/images/director-blockbuster-entertainment.jpg'),
  'global-markets-business.jpg': require('../../assets/images/global-markets-business.jpg'),
  'climate-legislation-politics.jpg': require('../../assets/images/climate-legislation-politics.jpg'),
  'cancer-treatment-health.jpg': require('../../assets/images/cancer-treatment-health.jpg'),
  'quantum-computing-technology.jpg': require('../../assets/images/quantum-computing-technology.jpg'),
};
```

## Updated News Data

Replace image fields in news data:
- `'curry.jpg'` → `'ai-breakthrough-tech.jpg'`
- `'Ronaldo.jpg'` → `'underdog-championship-sports.jpg'`
- `'SGA.jpg'` → `'exercise-study-science.jpg'`
- `'daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp'` → `'director-blockbuster-entertainment.jpg'`
- `'T1.jpg'` → `'global-markets-business.jpg'`
- `'w1.jpg'` → `'climate-legislation-politics.jpg'`
- `'MB.jpg'` → `'cancer-treatment-health.jpg'`
- `'yu.jpg'` → `'quantum-computing-technology.jpg'`

## Design Guidelines

- **Professional Quality**: News-worthy, credible appearance
- **Category Consistency**: Clear representation of news categories
- **Color Harmony**: Works with light/dark themes
- **High Resolution**: Crisp on mobile devices
- **News Aesthetic**: Journalistic, professional look 