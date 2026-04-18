export interface SuburbData {
  name: string;
  state: string;
  postcode: string;
}

export const australianSuburbs: SuburbData[] = [
  { name: 'Sydney', state: 'NSW', postcode: '2000' },
  { name: 'Melbourne', state: 'VIC', postcode: '3000' },
  { name: 'Brisbane', state: 'QLD', postcode: '4000' },
  { name: 'Perth', state: 'WA', postcode: '6000' },
  { name: 'Adelaide', state: 'SA', postcode: '5000' },
  { name: 'Hobart', state: 'TAS', postcode: '7000' },
  { name: 'Darwin', state: 'NT', postcode: '0800' },
  { name: 'Canberra', state: 'ACT', postcode: '2600' },
  { name: 'Parramatta', state: 'NSW', postcode: '2150' },
  { name: 'Chatswood', state: 'NSW', postcode: '2067' },
  { name: 'Bondi', state: 'NSW', postcode: '2026' },
  { name: 'Manly', state: 'NSW', postcode: '2095' },
  { name: 'Liverpool', state: 'NSW', postcode: '2170' },
  { name: 'Penrith', state: 'NSW', postcode: '2750' },
  { name: 'Blacktown', state: 'NSW', postcode: '2148' },
  { name: 'Bankstown', state: 'NSW', postcode: '2200' },
  { name: 'Ryde', state: 'NSW', postcode: '2112' },
  { name: 'Hornsby', state: 'NSW', postcode: '2077' },
  { name: 'St Leonards', state: 'NSW', postcode: '2065' },
  { name: 'North Sydney', state: 'NSW', postcode: '2060' },
  { name: 'Southbank', state: 'VIC', postcode: '3006' },
  { name: 'Richmond', state: 'VIC', postcode: '3121' },
  { name: 'St Kilda', state: 'VIC', postcode: '3182' },
  { name: 'Footscray', state: 'VIC', postcode: '3011' },
  { name: 'Dandenong', state: 'VIC', postcode: '3175' },
  { name: 'Geelong', state: 'VIC', postcode: '3220' },
  { name: 'Ballarat', state: 'VIC', postcode: '3350' },
  { name: 'Bendigo', state: 'VIC', postcode: '3550' },
  { name: 'Gold Coast', state: 'QLD', postcode: '4217' },
  { name: 'Sunshine Coast', state: 'QLD', postcode: '4558' },
  { name: 'Townsville', state: 'QLD', postcode: '4810' },
  { name: 'Cairns', state: 'QLD', postcode: '4870' },
  { name: 'Ipswich', state: 'QLD', postcode: '4305' },
  { name: 'Toowoomba', state: 'QLD', postcode: '4350' },
  { name: 'Fremantle', state: 'WA', postcode: '6160' },
  { name: 'Joondalup', state: 'WA', postcode: '6027' },
  { name: 'Rockingham', state: 'WA', postcode: '6168' },
  { name: 'Mandurah', state: 'WA', postcode: '6210' },
  { name: 'Glenelg', state: 'SA', postcode: '5045' },
  { name: 'Mount Gambier', state: 'SA', postcode: '5290' },
  { name: 'Whyalla', state: 'SA', postcode: '5600' },
  { name: 'Launceston', state: 'TAS', postcode: '7250' },
  { name: 'Devonport', state: 'TAS', postcode: '7310' },
  { name: 'Palmerston', state: 'NT', postcode: '0830' },
  { name: 'Alice Springs', state: 'NT', postcode: '0870' },
  { name: 'Wollongong', state: 'NSW', postcode: '2500' },
  { name: 'Newcastle', state: 'NSW', postcode: '2300' },
  { name: 'Central Coast', state: 'NSW', postcode: '2250' },
];

export function searchSuburbs(query: string): SuburbData[] {
  if (query.length < 2) return [];
  const lower = query.toLowerCase();
  return australianSuburbs.filter(
    (s) =>
      s.name.toLowerCase().includes(lower) ||
      s.postcode.includes(query)
  ).slice(0, 8);
}
