import TrackPlayer, { Event, State } from "react-native-track-player";

export const PlaybackService = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    console.log("Event.RemotePlay");
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    console.log("Event.RemotePause");
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    console.log("Event.RemoteStop");
    TrackPlayer.stop();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    console.log("Event.RemoteNext");
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    console.log("Event.RemotePrevious");
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.PlaybackState, (state) => {
    console.log("Playback state changed to:", state);
  });

  TrackPlayer.addEventListener(Event.PlaybackError, (error) => {
    console.error("Playback error:", error);
  });
};
