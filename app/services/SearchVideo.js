export default async function SearchVideo(query) {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${query}&key=${API_KEY}`);

    if (!response.ok) {
      throw new Error("Error en la petición a YouTube API");
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error en Search.js:", error);
    return [];
  }
}
