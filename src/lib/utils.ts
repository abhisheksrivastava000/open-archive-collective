import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getApiUrl = () => {
  return `http://${window.location.hostname}:3001`;
};

export const TRACKERS = [
  `ws://${window.location.hostname}:3001/tracker`,
  // Public trackers (commented out to reduce console noise during local dev)
  // "wss://tracker.openwebtorrent.com",
  // "wss://tracker.btorrent.xyz",
  // "wss://tracker.webtorrent.io",
  // "wss://tracker.files.fm:7073/announce",
  // "wss://wpe.project.ltd",
  // "wss://peertube.cpy.re/tracker/socket",
  // "wss://tracker.webtorrent.dev"
];
