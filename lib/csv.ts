import Papa from 'papaparse';

/**
 * Parse CSV content with standard options
 */
export function parseCSV<T = any>(content: string): T[] {
  try {
    const result = Papa.parse<T>(content, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });
    
    if (result.errors.length > 0) {
      console.error('CSV parse errors:', result.errors);
    }
    
    return result.data;
  } catch (error) {
    console.error('CSV parse error:', error);
    return [];
  }
}

/**
 * Parse CSV with custom delimiter
 */
export function parseCSVWithDelimiter<T = any>(content: string, delimiter: string): T[] {
  try {
    const result = Papa.parse<T>(content, {
      header: true,
      skipEmptyLines: true,
      delimiter,
      transformHeader: (header) => header.trim(),
    });
    
    if (result.errors.length > 0) {
      console.error('CSV parse errors:', result.errors);
    }
    
    return result.data;
  } catch (error) {
    console.error('CSV parse error:', error);
    return [];
  }
}
