// Lyrics Data
export type Lyrics = {
  StartTime: number;
  EndTime: number;
} & (SyllableLyric | LineLyric | StaticLyric);

export type LyricType = "Vocal";
// | "instrumental"
// | "backing"
// | "ad-lib"
// | "spoken";

export interface SyllableDictionary {
  Text: string;
  IsPartOfWord: boolean;
  StartTime: number;
  EndTime: number;
}

export interface SyllableLine {
  Syllables: Array<SyllableDictionary>;
  StartTime: number;
  EndTime: number;
}

export interface SyllableLyric {
  Type: "Syllable";
  Content: Array<{
    Type: LyricType;
    OppositeAligned: boolean;
    Lead: SyllableLine;
    Background?: Array<SyllableLine>;
  }>;
}

export interface LineDictionary
  extends Omit<SyllableDictionary, "IsPartOfWord"> {
  Type: LyricType;
  OppositeAligned: boolean;
}

export interface LineLyric {
  Type: "Line";
  Content: Array<LineDictionary>;
}

export interface StaticLyric {
  Type: "Static";
  Lines: Array<{
    Text: string;
  }>;
}
