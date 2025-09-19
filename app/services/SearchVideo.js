export default async function SearchVideo(query) {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    
    // Primer request: buscar videos
    const searchResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${query}&key=${API_KEY}`);

    if (!searchResponse.ok) {
      throw new Error("Error en la petición a YouTube API");
    }

    const searchData = await searchResponse.json();
    
    // Obtener IDs de los videos
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    
    // Segundo request: obtener estadísticas y detalles
    const detailsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${API_KEY}`);
    
    if (!detailsResponse.ok) {
      throw new Error("Error obteniendo detalles de videos");
    }
    
    const detailsData = await detailsResponse.json();
    
    // Combinar datos
    const videosWithStats = searchData.items.map(video => {
      const stats = detailsData.items.find(detail => detail.id === video.id.videoId);
      return {
        ...video,
        statistics: stats?.statistics || {},
        contentDetails: stats?.contentDetails || {}
      };
    });
    
    return videosWithStats;
  } catch (error) {
    console.error("Error en Search.js:", error);
    return [];
  }
}