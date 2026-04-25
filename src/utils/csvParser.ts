import csvParser from 'csv-parser';
import { Readable } from 'stream';
import { z } from 'zod';
import { geocodeAddress } from '../services/maps.service';

const CsvRowSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(''),
  type: z.enum(['apartment', 'villa', 'plot', 'commercial', 'house']),
  price: z.coerce.number().positive(),
  area: z.coerce.number().positive(),
  street: z.string().optional().default(''),
  city: z.string().min(1),
  state: z.string().optional().default(''),
  country: z.string().min(1),
  amenities: z.string().optional().default(''),
  images: z.string().optional().default(''),
});

export type CsvRow = z.infer<typeof CsvRowSchema>;

export interface ParseResult {
  inserted: CsvRow[];
  failed: Array<{ row: number; error: string }>;
}

export async function parseCsvBuffer(buffer: Buffer): Promise<ParseResult> {
  const rows: Record<string, string>[] = await new Promise((resolve, reject) => {
    const results: Record<string, string>[] = [];
    Readable.from(buffer)
      .pipe(csvParser())
      .on('data', (data: Record<string, string>) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });

  const inserted: CsvRow[] = [];
  const failed: Array<{ row: number; error: string }> = [];

  for (let i = 0; i < rows.length; i++) {
    const parsed = CsvRowSchema.safeParse(rows[i]);
    if (!parsed.success) {
      failed.push({ row: i + 2, error: parsed.error.message });
      continue;
    }
    inserted.push(parsed.data);
  }

  return { inserted, failed };
}

export async function enrichWithGeocode(
  rows: CsvRow[]
): Promise<Array<CsvRow & { lat?: number; lng?: number }>> {
  return Promise.all(
    rows.map(async (row) => {
      const addressStr = [row.street, row.city, row.state, row.country]
        .filter(Boolean)
        .join(', ');
      try {
        const coords = await geocodeAddress(addressStr);
        return { ...row, ...coords };
      } catch {
        return { ...row };
      }
    })
  );
}
