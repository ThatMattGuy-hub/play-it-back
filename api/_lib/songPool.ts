import { Song } from './types';
import songsData from './songs.json';

export const songPool: Song[] = songsData as unknown as Song[];
