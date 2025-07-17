import React, { createContext, useContext, useState } from 'react';

// Import demoNews from news.jsx (copy the array here for now, or import if modularized)
const demoNews = [
  {
    id: 'n1',
    user: 'BBC News',
    avatar: 'BBC.jpg',
    title: 'Quantum Computing Milestone Achieved by Research Team (UPDATED)',
    excerpt: 'A major breakthrough in quantum computing could revolutionize technology as we know it.',
    image: 'ai-breakthrough-tech.jpg',
    category: 'Technology',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    upvotes: 1234,
    comments: 56,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
  {
    id: 'n2',
    user: 'ESPN',
    avatar: 'ESPN.jpg',
    title: 'Underdog Team Chelsea FC wins Club world cup in Stunning Upset',
    excerpt: 'Fans celebrate as the underdog team clinches the title in a dramatic final match.',
    image: 'underdog-championship-sports.jpg',
    category: 'Sports',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    upvotes: 987,
    comments: 34,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
  {
    id: 'n3',
    user: 'Science Daily',
    avatar: 'science.jpg',
    title: 'New Study Reveals Benefits of Daily Exercise',
    excerpt: 'Researchers find that even moderate daily exercise can have significant health benefits.',
    image: 'exercise-study-science.jpg',
    category: 'Health',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    upvotes: 654,
    comments: 21,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
  {
    id: 'n4',
    user: 'Variety',
    avatar: 'commenter4.jpg',
    title: 'Award-Winning Director Announces New Blockbuster',
    excerpt: 'The acclaimed director teases fans with details of an upcoming film project.',
    image: 'director-blockbuster-entertainment.jpg',
    category: 'Entertainment',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    upvotes: 432,
    comments: 12,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
  {
    id: 'n5',
    user: 'Bloomberg',
    avatar: 'commenter5.jpg',
    title: 'Global Markets Rally After Economic Report',
    excerpt: 'Stock markets around the world surged following positive economic news.',
    image: 'global-markets-business.jpg',
    category: 'Business',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
    upvotes: 321,
    comments: 8,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
  {
    id: 'n6',
    user: 'Reuters',
    avatar: 'commenter6.jpg',
    title: 'New Climate Legislation Passed by Parliament',
    excerpt: 'Lawmakers have approved sweeping new measures to address climate change.',
    image: 'climate-legislation-politics.jpg',
    category: 'Politics',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    upvotes: 210,
    comments: 5,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
  {
    id: 'n7',
    user: 'Healthline',
    avatar: 'Pulse-on-Global-Health.jpg',
    title: 'Breakthrough in Cancer Treatment Announced',
    excerpt: 'A new therapy shows promise in treating certain types of cancer.',
    image: 'cancer-treatment-health.jpg',
    category: 'Health',
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000),
    upvotes: 198,
    comments: 3,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
  {
    id: 'n8',
    user: 'TechCrunch',
    avatar: 'commenter8.jpg',
    title: 'Quantum Computing: The Next Big Leap',
    excerpt: 'Experts discuss the future of quantum computing and its potential impact.',
    image: 'quantum-computing-technology.jpg',
    category: 'Technology',
    timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000),
    upvotes: 150,
    comments: 2,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
];

const NewsContext = createContext();

export function NewsProvider({ children }) {
  const [newsList, setNewsList] = useState(demoNews);
  return (
    <NewsContext.Provider value={{ newsList, setNewsList }}>
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  return useContext(NewsContext);
} 