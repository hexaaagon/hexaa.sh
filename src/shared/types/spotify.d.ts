// Lyrics Data
export type Lyrics = {
  startTime: number;
  endTime: number;
} & (SyllableLyric | LineLyric | StaticLyric);

export type LyricType = "vocal";
// | "instrumental"
// | "backing"
// | "ad-lib"
// | "spoken";

export interface SyllableDictionary {
  text: string;
  isPartOfWord: boolean;
  startTime: number;
  endTime: number;
}

export interface SyllableLine {
  syllables: Array<SyllableDictionary>;
  startTime: number;
  endTime: number;
}

export interface SyllableLyric {
  type: "syllable";
  content: Array<{
    type: LyricType;
    oppositeAligned: boolean;
    lead: SyllableLine;
    background?: Array<SyllableLine>;
  }>;
}

export interface LineDictionary
  extends Omit<SyllableDictionary, "isPartOfWord"> {
  type: LyricType;
  oppositeAligned: boolean;
}

export interface LineLyric {
  type: "line";
  content: Array<LineDictionary>;
}

export interface StaticLyric {
  type: "static";
  lines: Array<{
    text: string;
  }>;
}

// Lyrics Response from API
export interface LyricsResponse {
  success: boolean;
  data: Lyrics;
  pagination: {
    lyrics: {
      backward: number;
      current: number;
      future: number;
    };
    cache: {
      totalSize: number; // KB
      currentSize: number; // KB
      nextSize: number; // KB
      type: "LRU" | "REDIS";
    } & (
      | {
          rate: "HIT";
          date: Date;
          views: number;
        }
      | {
          rate: "MISS";
          created: boolean;
        }
    );
    nextFetch: number;
    recommendedNextFetch: number;
  };
}
