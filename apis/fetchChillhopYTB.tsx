import libary from "../assets/data/libary.json";

export interface YouTubeTrack {
  url: string;
  title: string;
  artist?: string;
  artwork?: string;
  rating?: number;
  playlist?: string[];
}

export const fetchPlaylistItems = async (): // playlistId: string,
// playlistName: string
Promise<YouTubeTrack[]> => {
  try {
    // const response = await fetch(
    //   `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`
    // );
    // const response = await fetch(
    //   `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=PLt7bG0K25iXj2h1eql20RZIPB_2CtK659&key=AIzaSyDNV3fEHS74KX9RlrJoJQQ8QIp7lCD8upI`
    // );

    // if (!response.ok) {
    //   throw new Error(`YouTube API error: ${response.status}`);
    // }

    // const data = await response.json();

    // console.log("Fetched playlist items:", data.items);

    // return data.items.map((item: any) => {
    //   const { title: fullTitle, thumbnails } = item.snippet;
    //   const { title, artist } = extractArtistFromTitle(fullTitle);

    //   return {
    //     id: item.snippet.resourceId.videoId,
    //     title,
    //     artist,
    //     artwork:
    //       thumbnails.high?.url ||
    //       thumbnails.medium?.url ||
    //       thumbnails.default?.url,
    //     // playlistName,
    //   };
    // });
    return libary;
  } catch (error) {
    console.error(`Error fetching playlist`, error);
    return [];
  }
};

export const fetchAllChillhopTracks = async (): Promise<YouTubeTrack[]> => {
  try {
    // const results = fetchPlaylistItems(
    //   "PLt7bG0K25iXj2h1eql20RZIPB_2CtK659",
    //   "Chillhop Mixes"
    // );
    const results = fetchPlaylistItems();

    return results;
  } catch (error) {
    console.error("Error fetching all Chillhop tracks:", error);
    return [];
  }
};
