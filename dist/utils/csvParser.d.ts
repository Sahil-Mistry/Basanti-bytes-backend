import { z } from 'zod';
declare const CsvRowSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    type: z.ZodEnum<["apartment", "villa", "plot", "commercial", "house"]>;
    price: z.ZodNumber;
    area: z.ZodNumber;
    street: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    city: z.ZodString;
    state: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    country: z.ZodString;
    amenities: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    images: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    type: "apartment" | "villa" | "plot" | "commercial" | "house";
    description: string;
    title: string;
    price: number;
    area: number;
    amenities: string;
    images: string;
    street: string;
    city: string;
    state: string;
    country: string;
}, {
    type: "apartment" | "villa" | "plot" | "commercial" | "house";
    title: string;
    price: number;
    area: number;
    city: string;
    country: string;
    description?: string | undefined;
    amenities?: string | undefined;
    images?: string | undefined;
    street?: string | undefined;
    state?: string | undefined;
}>;
export type CsvRow = z.infer<typeof CsvRowSchema>;
export interface ParseResult {
    inserted: CsvRow[];
    failed: Array<{
        row: number;
        error: string;
    }>;
}
export declare function parseCsvBuffer(buffer: Buffer): Promise<ParseResult>;
export declare function enrichWithGeocode(rows: CsvRow[]): Promise<Array<CsvRow & {
    lat?: number;
    lng?: number;
}>>;
export {};
//# sourceMappingURL=csvParser.d.ts.map