export function normalizeReferenceMonth(value: string): string {
  const months: Record<string, string> = {
    JAN: '01',
    FEV: '02',
    MAR: '03',
    ABR: '04',
    MAI: '05',
    JUN: '06',
    JUL: '07',
    AGO: '08',
    SET: '09',
    OUT: '10',
    NOV: '11',
    DEZ: '12',
  };

  if (!value) return value;

  if (/^\d{4}-\d{2}$/.test(value)) return value;

  const match = value.toUpperCase().match(/([A-Z]{3})\/(\d{4})/);
  if (match) {
    const month = months[match[1]];
    const year = match[2];
    return `${year}-${month}`;
  }

  return value;
}
