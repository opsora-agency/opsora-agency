// brandsData.tsx
import { Brand } from "@/types/brand";

// Split tools into two groups for different animation directions
export const topRowBrands: Brand[] = [
  // AI & Automation
  { 
  id: 1, 
  name: "OpenAI", 
  href: "https://openai.com", 
  // Using ChatGPT logo which is more visible
  image: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  // Using colored OpenAI logo for dark mode
  imageLight: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
   
},
  { 
    id: 2, 
    name: "LangChain", 
    href: "https://python.langchain.com", 
    image: "https://cdn.simpleicons.org/langchain/FB8500", // Orange logo
    imageLight: "https://cdn.simpleicons.org/langchain/FFB347", // Lighter orange for dark mode
    
  },
  { 
    id: 3, 
    name: "Zapier", 
    href: "https://zapier.com", 
    image: "https://cdn.simpleicons.org/zapier/FF4A00", // Zapier orange
    imageLight: "https://cdn.simpleicons.org/zapier/FF7B42", // Lighter orange
     
  },
  { 
    id: 4, 
    name: "Make", 
    href: "https://www.make.com", 
    image: "https://cdn.simpleicons.org/make/1E1E1E", // Dark gray
    imageLight: "https://cdn.simpleicons.org/make/888888", // Light gray
    
  },
  { 
    id: 5, 
    name: "Anthropic", 
    href: "https://www.anthropic.com", 
    image: "https://cdn.simpleicons.org/anthropic/1C3B70", // Dark blue
    imageLight: "https://cdn.simpleicons.org/anthropic/5C8DE8", // Light blue
    
  },
  
  // Marketing
  { 
    id: 6, 
    name: "Google Ads", 
    href: "https://ads.google.com", 
    image: "https://cdn.simpleicons.org/googleads/4285F4", // Google blue
    imageLight: "https://cdn.simpleicons.org/googleads/8AB4F8", // Lighter blue
    
  },
  { 
    id: 7, 
    name: "Meta Ads", 
    href: "https://www.facebook.com/business/ads", 
    image: "https://cdn.simpleicons.org/facebook/1877F2", // Facebook blue
    imageLight: "https://cdn.simpleicons.org/facebook/5C9DF2", // Lighter blue
    
  },
  { 
    id: 8, 
    name: "HubSpot", 
    href: "https://www.hubspot.com", 
    image: "https://cdn.simpleicons.org/hubspot/FF7A59", // HubSpot orange
    imageLight: "https://cdn.simpleicons.org/hubspot/FFA68A", // Lighter orange
    
  },
  { 
    id: 9, 
    name: "Google Analytics", 
    href: "https://analytics.google.com", 
    image: "https://cdn.simpleicons.org/googleanalytics/E37400", // Google Analytics orange
    imageLight: "https://cdn.simpleicons.org/googleanalytics/FF9D4D", // Lighter orange
    
  },
  { 
    id: 10, 
    name: "SEMrush", 
    href: "https://www.semrush.com", 
    image: "https://cdn.simpleicons.org/semrush/FF6B6B", // Red
    imageLight: "https://cdn.simpleicons.org/semrush/FF9E9E", // Lighter red
    
  },
  
  // Web Development
  { 
    id: 11, 
    name: "React", 
    href: "https://reactjs.org", 
    image: "https://cdn.simpleicons.org/react/61DAFB", // React blue
    imageLight: "https://cdn.simpleicons.org/react/98E6FB", // Lighter blue
    
  },
  { 
    id: 12, 
    name: "Next.js", 
    href: "https://nextjs.org", 
    image: "https://cdn.simpleicons.org/nextdotjs/000000", // Black for light mode
    imageLight: "https://cdn.simpleicons.org/nextdotjs/FFFFFF", // White for dark mode
    
  },
  { 
    id: 13, 
    name: "TypeScript", 
    href: "https://www.typescriptlang.org", 
    image: "https://cdn.simpleicons.org/typescript/3178C6", // TypeScript blue
    imageLight: "https://cdn.simpleicons.org/typescript/6FA8DC", // Lighter blue
    
  },
  { 
    id: 14, 
    name: "Tailwind", 
    href: "https://tailwindcss.com", 
    image: "https://cdn.simpleicons.org/tailwindcss/06B6D4", // Tailwind cyan
    imageLight: "https://cdn.simpleicons.org/tailwindcss/67E8F9", // Lighter cyan
    
  },
  { 
    id: 15, 
    name: "Node.js", 
    href: "https://nodejs.org", 
    image: "https://cdn.simpleicons.org/nodedotjs/339933", // Node.js green
    imageLight: "https://cdn.simpleicons.org/nodedotjs/66CC99", // Lighter green
     
  },
];

export const bottomRowBrands: Brand[] = [
  // More AI & Automation
  { 
    id: 16, 
    name: "n8n", 
    href: "https://n8n.io", 
    image: "https://cdn.simpleicons.org/n8n/FF6B6B", // Red
    imageLight: "https://cdn.simpleicons.org/n8n/FF9E9E", // Lighter red
     
  },
  { 
    id: 17, 
    name: "Hugging Face", 
    href: "https://huggingface.co", 
    image: "https://cdn.simpleicons.org/huggingface/FFD21E", // Yellow
    imageLight: "https://cdn.simpleicons.org/huggingface/FFE87C", // Lighter yellow
    
  },
  
  // More Marketing
  { 
    id: 18, 
    name: "Mailchimp", 
    href: "https://mailchimp.com", 
    image: "https://cdn.simpleicons.org/mailchimp/FFE01B", // Mailchimp yellow
    imageLight: "https://cdn.simpleicons.org/mailchimp/FFEC70", // Lighter yellow
    
  },
  { 
    id: 19, 
    name: "Ahrefs", 
    href: "https://ahrefs.com", 
    image: "https://placehold.co/160x80/FF6B35/FFFFFF?text=Ahrefs&font=inter", // Ahrefs orange
    imageLight: "https://placehold.co/160x80/FF9E7A/000000?text=Ahrefs&font=inter", // Lighter orange
     
  },
  
  // More Web Development
  { 
    id: 20, 
    name: "MongoDB", 
    href: "https://www.mongodb.com", 
    image: "https://cdn.simpleicons.org/mongodb/47A248", // MongoDB green
    imageLight: "https://cdn.simpleicons.org/mongodb/7BC47F", // Lighter green
    
  },
  { 
    id: 21, 
    name: "PostgreSQL", 
    href: "https://www.postgresql.org", 
    image: "https://cdn.simpleicons.org/postgresql/336791", // PostgreSQL blue
    imageLight: "https://cdn.simpleicons.org/postgresql/6FA0D4", // Lighter blue
    
  },
  { 
    id: 22, 
    name: "Vercel", 
    href: "https://vercel.com", 
    image: "https://cdn.simpleicons.org/vercel/000000", // Black for light
    imageLight: "https://cdn.simpleicons.org/vercel/FFFFFF", // White for dark
     
  },
  { 
  id: 23, 
  name: "AWS", 
  href: "https://aws.amazon.com", 
  // Full color AWS logo (not just icon)
  image: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
  imageLight: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg?color=white",
   
},
  { 
    id: 24, 
    name: "Docker", 
    href: "https://www.docker.com", 
    image: "https://cdn.simpleicons.org/docker/2496ED", // Docker blue
    imageLight: "https://cdn.simpleicons.org/docker/6FBFFF", // Lighter blue
     
  },
  { 
    id: 25, 
    name: "GraphQL", 
    href: "https://graphql.org", 
    image: "https://cdn.simpleicons.org/graphql/E10098", // GraphQL pink
    imageLight: "https://cdn.simpleicons.org/graphql/FF66CC", // Lighter pink
     
  },
  { 
    id: 26, 
    name: "Firebase", 
    href: "https://firebase.google.com", 
    image: "https://cdn.simpleicons.org/firebase/FFCA28", // Firebase yellow
    imageLight: "https://cdn.simpleicons.org/firebase/FFE082", // Lighter yellow
    
  },
  { 
    id: 27, 
    name: "Python", 
    href: "https://python.org", 
    image: "https://cdn.simpleicons.org/python/3776AB", // Python blue
    imageLight: "https://cdn.simpleicons.org/python/6FA8DC", // Lighter blue
     
  },
  { 
    id: 28, 
    name: "GitHub", 
    href: "https://github.com", 
    image: "https://cdn.simpleicons.org/github/181717", // Dark gray
    imageLight: "https://cdn.simpleicons.org/github/888888", // Light gray
     
  },
];

// For backward compatibility
const allBrands = [...topRowBrands, ...bottomRowBrands];
export default allBrands;