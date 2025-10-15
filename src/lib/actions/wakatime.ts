"use server";

import { LRUCache } from "lru-cache";

export interface WakaTimeData {
  total_seconds: number;
  total_seconds_including_other_language: number;
  human_readable_total: string;
  human_readable_total_including_other_language: string;
  daily_average: number;
  daily_average_including_other_language: number;
  human_readable_daily_average: string;
  human_readable_daily_average_including_other_language: string;
  categories: Array<{
    name: string;
    total_seconds: number;
    percent: number;
    digital: string;
    text: string;
    hours: number;
    minutes: number;
  }>;
  projects: Array<{
    name: string;
    total_seconds: number;
    percent: number;
    digital: string;
    text: string;
    hours: number;
    minutes: number;
  }>;
  languages: Array<{
    name: string;
    total_seconds: number;
    percent: number;
    digital: string;
    text: string;
    hours: number;
    minutes: number;
    seconds: number;
  }>;
  editors: Array<{
    name: string;
    total_seconds: number;
    percent: number;
    digital: string;
    text: string;
    hours: number;
    minutes: number;
    seconds: number;
  }>;
  operating_systems: Array<{
    name: string;
    total_seconds: number;
    percent: number;
    digital: string;
    text: string;
    hours: number;
    minutes: number;
    seconds: number;
  }>;
  dependencies: Array<{
    name: string;
    total_seconds: number;
    percent: number;
    digital: string;
    text: string;
    hours: number;
    minutes: number;
    seconds: number;
  }>;
  machines: Array<{
    name: string;
    machine_name_id: string;
    total_seconds: number;
    percent: number;
    digital: string;
    text: string;
    hours: number;
    minutes: number;
    seconds: number;
  }>;
  best_day: {
    date: string;
    text: string;
    total_seconds: number;
  };
  range: string;
  human_readable_range: string;
  holidays: number;
  days_including_holidays: number;
  days_minus_holidays: number;
  status: string;
  percent_calculated: number;
  is_already_updating: boolean;
  is_coding_activity_visible: boolean;
  is_language_usage_visible: boolean;
  is_editor_usage_visible: boolean;
  is_category_usage_visible: boolean;
  is_os_usage_visible: boolean;
  is_stuck: boolean;
  is_including_today: boolean;
  is_up_to_date: boolean;
  start: string;
  end: string;
  timezone: string;
  timeout: number;
  writes_only: boolean;
  user_id: string;
  username: string;
  created_at: string;
  modified_at: string;
}

// LRU cache configuration
// cache will hold 1 item (the wakatime data) for 12 hours (43200000 ms)
const wakaTimeCache = new LRUCache<string, WakaTimeData>({
  max: 1,
  ttl: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
});

const CACHE_KEY = "wakatime_stats";

export async function wakaTimeData(): Promise<WakaTimeData> {
  // check if data exists in cache
  const cachedData = wakaTimeCache.get(CACHE_KEY);
  if (cachedData) {
    return cachedData;
  }

  const res = await fetch(
    "https://wakatime.com/api/v1/users/5863d56e-d5ae-4b4c-bb4e-350fe0f22338/stats/all_time?timeout=15",
  );

  if (!res.ok) {
    throw new Error("Failed to fetch WakaTime data");
  }

  const data = await res.json().then((data) => data.data as WakaTimeData);

  wakaTimeCache.set(CACHE_KEY, data);

  return data;
}
