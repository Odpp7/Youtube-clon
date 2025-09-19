export default async function getVideoDetails(videoId) {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

    // Info principal
    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${API_KEY}`
    );
    if (!videoRes.ok) throw new Error("Error obteniendo detalles del video");
    const videoData = await videoRes.json();
    const video = videoData.items[0];

    // Comentarios
    const commentsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=20&key=${API_KEY}`
    );
    const commentsData = commentsRes.ok ? await commentsRes.json() : { items: [] };

    return {
      ...video,
      comments: commentsData.items.map(c => ({
        author: c.snippet.topLevelComment.snippet.authorDisplayName,
        text: c.snippet.topLevelComment.snippet.textDisplay,
        likes: c.snippet.topLevelComment.snippet.likeCount,
        publishedAt: c.snippet.topLevelComment.snippet.publishedAt,
      }))
    };
  } catch (error) {
    console.error("Error en getVideoDetails:", error);
    return null;
  }
}
