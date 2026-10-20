/** YouTube replays for the October 2026 edition, oldest first. */
export const VIDS: Array<[id: string, day: number]> = [
  ["-saBS2ggyi4", 1],
  ["Dvp9hyZW2Ys", 2],
  ["2Dxd2wwRLLc", 3],
  ["hUWaCZzU31U", 4],
  ["SN4z3UyvFVE", 5],
  ["18KAjo4RmVU", 6],
  ["adUtqYoDOw0", 7],
  ["i0O00TOi-Kw", 8],
  ["FmECe4ZcXB0", 9],
  ["CCDHi8mjfb4", 10],
  ["rkc184yQ-kM", 11],
  ["NyDXTX1ghK0", 12],
  ["h7quyM65iVk", 13],
];

export const videoTitle = (day: number) => `HALLELUJAH CHALLENGE || OCT 2026 || DAY ${day}`;

export interface OpenVideo {
  id: string;
  day: number;
}
