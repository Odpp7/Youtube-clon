const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export default async function SearchVideo(query) {
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${query}&key=${API_KEY}`);

    
  } catch (error) {
    console.error("Error en Search.js:", error);
    return [];
  }
}
