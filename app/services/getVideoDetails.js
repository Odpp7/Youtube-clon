export default async function getVideoDetails(videoId) {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

    // 🔹 Info del video
    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${API_KEY}`
    );
    if (!videoRes.ok) throw new Error("Error obteniendo detalles del video");
    const videoData = await videoRes.json();
    const video = videoData.items[0];

    if (!video) return null;

    // 🔹 Info del canal (foto, subs)
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${video.snippet.channelId}&key=${API_KEY}`
    );
    const channelData = await channelRes.json();
    const channel = channelData.items[0];

    // 🔹 Comentarios
    const commentsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=20&key=${API_KEY}`
    );
    const commentsData = commentsRes.ok ? await commentsRes.json() : { items: [] };

    return {
      ...video,
      channelInfo: {
        title: channel.snippet.title,
        thumbnail: channel.snippet.thumbnails.default.url,
        subs: channel.statistics.subscriberCount,
      },
      comments: commentsData.items.map((c) => ({
        author: c.snippet.topLevelComment.snippet.authorDisplayName,
        authorProfileImageUrl: c.snippet.topLevelComment.snippet.authorProfileImageUrl,
        text: c.snippet.topLevelComment.snippet.textDisplay,
        likes: c.snippet.topLevelComment.snippet.likeCount,
        publishedAt: c.snippet.topLevelComment.snippet.publishedAt,
      })),
    };
  } catch (error) {
    console.error("Error en getVideoDetails:", error);
    return null;
  }
}
