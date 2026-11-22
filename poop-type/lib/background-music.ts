export type MusicPlaybackStatus = "playing" | "paused" | "blocked";
export type MusicPreference = "on" | "off";

export const MUSIC_PREF_STORAGE_KEY = "pooptype_music_pref";

/**
 * Parses a stored sessionStorage preference. Defaults to "on" so background
 * music attempts automatic playback for new visits.
 */
export function resolveInitialMusicPreference(
  storedValue: string | null | undefined
): MusicPreference {
  return storedValue === "off" ? "off" : "on";
}

/**
 * Computes the playback status immediately after attempting autoplay on mount.
 */
export function resolveAutoplayResult(
  succeeded: boolean
): MusicPlaybackStatus {
  return succeeded ? "playing" : "blocked";
}

/**
 * Determines whether the first user gesture should unlock blocked autoplay.
 */
export function shouldUnlockOnGesture(
  status: MusicPlaybackStatus,
  preference: MusicPreference
): boolean {
  return status === "blocked" && preference === "on";
}

/**
 * Determines the action to run when the user taps the floating play/pause button.
 */
export function getToggleAction(status: MusicPlaybackStatus): "pause" | "play" {
  return status === "playing" ? "pause" : "play";
}
