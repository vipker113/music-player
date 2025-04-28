export interface Track {
  id: string;
  url: string;
  title: string;
  artist?: string;
  artwork?: string;
  rating?: number;
  playlist?: string[];
  favorite?: boolean;
}

export const fetchPlaylistItems = async (): Promise<Track[]> => {
  try {
    const response = await fetch(
      "https://680f259667c5abddd193fe42.mockapi.io/api/v1/track"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching playlist`, error);
    return [];
  }
};

export const fetchAllChillhopTracks = async (): Promise<Track[]> => {
  try {
    const results = fetchPlaylistItems();

    return results;
  } catch (error) {
    console.error("Error fetching all Chillhop tracks:", error);
    return [];
  }
};

export const updateFavoriteTrack = async (
  id: string,
  favorite: boolean
): Promise<void> => {
  try {
    await fetch(
      `https://680f259667c5abddd193fe42.mockapi.io/api/v1/track/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favorite }),
      }
    );
  } catch (error) {
    console.error("Error updating track:", error);
  }
};
