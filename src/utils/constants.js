export const HISTORY_STORAGE_KEY = 'translation_history_academic_v2';
export const ANNOTATIONS_STORAGE_KEY = 'hermeneia_annotations_v1';

export const ART_HISTORY_PRESETS = [
  { word: 'памятники искусства', meaning: 'art monuments / masterworks of art' },
  { word: 'миниатюра', meaning: 'miniature painting / illuminated folio' },
  { word: 'определение сюжетов', meaning: 'identification of subjects / iconographical analysis' },
  { word: 'рукопись на пальмовых листьях', meaning: 'palm-leaf manuscript' },
  { word: 'вступительная статья', meaning: 'introductory essay / introduction' },
  { word: 'составитель альбома', meaning: 'album compiler / curator' },
  { word: 'лаковый оклад', meaning: 'lacquered cover / binding' },
  { word: 'Бабур-наме', meaning: 'Baburnama / Babur-name' },
  { word: 'парча', meaning: 'brocade textile / gold tissue' },
  { word: 'чеканка', meaning: 'repoussé / chasing work' },
];

export const CITATION_LABELS = {
  book_title: 'Book Title',
  museum_name: 'Museum / Institution',
  artist_name: 'Artist / Author',
  date: 'Date / Period',
  catalogue_ref: 'Catalogue Reference',
};

export const DEFAULT_GLOSSARY = [
  { word: 'памятники искусства', meaning: 'monuments of art / masterworks' },
  { word: 'Государственный Эрмитаж', meaning: 'State Hermitage Museum' },
];

export const PROFILES = [
  { id: 'art_history', label: '🎨 Art & Museology' },
  { id: 'academic', label: '📖 Humanities' },
  { id: 'literary', label: '✍️ Literary Prose' },
  { id: 'legal', label: '⚖️ Legal & Treaties' },
];
