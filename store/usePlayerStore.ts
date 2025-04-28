import { create } from "zustand";
import { Audio } from "expo-av";
import { fetchAllChillhopTracks, Track } from "@/apis/fetchChillhopYTB";

type RepeatMode = "off" | "repeat-one" | "repeat-all" | "shuffle";

type PlayerState = {
  tracks: Track[];
  currentTrack: Track | null;
  sound: Audio.Sound | null;
  isPlaying: boolean;
  isLoading: boolean;
  repeatMode: RepeatMode;
  progress: number;
  duration: number;
  volume: number;
  fetchTracks: () => Promise<void>;
  playTrack: (track: Track) => Promise<void>;
  playNext: () => Promise<void>;
  playPrev: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  toggleRepeatMode: () => void;
  cleanup: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  tracks: [],
  currentTrack: null,
  sound: null,
  isPlaying: false,
  isLoading: false,
  repeatMode: "off",
  progress: 0,
  duration: 1,
  volume: 1,
  fetchTracks: async () => {
    try {
      set({ isLoading: true });

      const chillhopTracks = await fetchAllChillhopTracks();

      const tracks: Track[] = chillhopTracks.map((track) => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        artwork: track.artwork,
        url: track.url,
        playlist: track.playlist,
        favorite: track.favorite,
        rating: track.rating,
      }));

      set({ tracks, isLoading: false });
    } catch (error) {
      console.error("Error fetching tracks:", error);
      set({ isLoading: false });
    }
  },

  playTrack: async (track) => {
    try {
      if (
        get().isLoading ||
        (get().currentTrack?.url === track.url && get().isPlaying)
      ) {
        return;
      }
      set({ isLoading: true });

      const currentSound = get().sound;
      if (currentSound) {
        await currentSound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: true }
      );

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          set({
            isPlaying: status.isPlaying,
            progress: status.positionMillis || 0,
            duration: status.durationMillis || 1,
          });

          if (status.didJustFinish && !status.isLooping) {
            get().playNext();
          }
        }
      });

      set({
        currentTrack: track,
        sound: sound,
        isPlaying: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error playing track:", error);
      set({ isLoading: false });
    }
  },
  playNext: async () => {
    const { tracks, currentTrack, repeatMode, playTrack } = get();
    if (!currentTrack || tracks.length === 0) return;

    let nextTrack: Track | null = null;
    const currentIndex = tracks.findIndex((t) => t.url === currentTrack.url);

    if (repeatMode === "shuffle") {
      const otherTracks = tracks.filter((t) => t.url !== currentTrack.url);
      nextTrack = otherTracks[Math.floor(Math.random() * otherTracks.length)];
    } else {
      if (repeatMode === "repeat-one") {
        await get().seekTo(0);
        await get().togglePlayPause();
      } else {
        const nextIndex =
          currentIndex === tracks.length - 1
            ? repeatMode === "repeat-all"
              ? 0
              : -1
            : currentIndex + 1;

        nextTrack = tracks[nextIndex] || null;
      }
    }

    if (nextTrack) {
      await playTrack(nextTrack);
    }
  },

  playPrev: async () => {
    const { tracks, currentTrack, playTrack } = get();
    if (!currentTrack || tracks.length === 0) return;

    const currentIndex = tracks.findIndex((t) => t.url === currentTrack.url);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;

    const prevTrack = tracks[prevIndex];
    if (prevTrack) {
      await playTrack(prevTrack);
    }
  },

  togglePlayPause: async () => {
    const { sound, isPlaying } = get();
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  },

  toggleRepeatMode: () => {
    const modes: RepeatMode[] = ["off", "repeat-one", "repeat-all", "shuffle"];
    const current = modes.indexOf(get().repeatMode);
    const next = (current + 1) % modes.length;
    set({ repeatMode: modes[next] });
  },

  cleanup: async () => {
    const { sound } = get();
    if (sound) {
      await sound.unloadAsync();
    }
    set({ sound: null, isPlaying: false, currentTrack: null, progress: 0 });
  },
  seekTo: async (positionMillis) => {
    const { sound } = get();
    if (sound) {
      try {
        await sound.setPositionAsync(positionMillis);
        set({ progress: positionMillis });
      } catch (error) {
        console.error("Error seeking:", error);
      }
    }
  },
  setVolume: async (volume) => {
    const { sound } = get();
    if (sound) {
      try {
        await sound.setVolumeAsync(volume);
      } catch (error) {
        console.error("Error setting volume:", error);
      }
    }
    set({ volume });
  },
}));
