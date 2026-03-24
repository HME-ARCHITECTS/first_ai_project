import { z } from "zod";
export declare const StoreSessionSchema: z.ZodObject<{
    storeId: z.ZodString;
    installerId: z.ZodString;
    cameraSlot: z.ZodNumber;
    environment: z.ZodLiteral<"Drive-Thru">;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    storeId: string;
    installerId: string;
    cameraSlot: number;
    environment: "Drive-Thru";
    timestamp: string;
}, {
    storeId: string;
    installerId: string;
    cameraSlot: number;
    environment: "Drive-Thru";
    timestamp: string;
}>;
export type StoreSession = z.infer<typeof StoreSessionSchema>;
export declare const PointOfInterestSchema: z.ZodObject<{
    id: z.ZodString;
    x: z.ZodNumber;
    y: z.ZodNumber;
    timestamp: z.ZodString;
    location: z.ZodObject<{
        lat: z.ZodNumber;
        lng: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        lat: number;
        lng: number;
    }, {
        lat: number;
        lng: number;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    x: number;
    y: number;
    location: {
        lat: number;
        lng: number;
    };
}, {
    timestamp: string;
    id: string;
    x: number;
    y: number;
    location: {
        lat: number;
        lng: number;
    };
}>;
export type PointOfInterest = z.infer<typeof PointOfInterestSchema>;
export declare const CreateSessionRequestSchema: z.ZodObject<{
    storeId: z.ZodString;
    installerId: z.ZodString;
    cameraSlot: z.ZodNumber;
    environment: z.ZodLiteral<"Drive-Thru">;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    storeId: string;
    installerId: string;
    cameraSlot: number;
    environment: "Drive-Thru";
    timestamp: string;
}, {
    storeId: string;
    installerId: string;
    cameraSlot: number;
    environment: "Drive-Thru";
    timestamp: string;
}>;
export type CreateSessionRequest = z.infer<typeof CreateSessionRequestSchema>;
export declare const AddPoiRequestSchema: z.ZodObject<{
    id: z.ZodString;
    x: z.ZodNumber;
    y: z.ZodNumber;
    timestamp: z.ZodString;
    location: z.ZodObject<{
        lat: z.ZodNumber;
        lng: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        lat: number;
        lng: number;
    }, {
        lat: number;
        lng: number;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    x: number;
    y: number;
    location: {
        lat: number;
        lng: number;
    };
}, {
    timestamp: string;
    id: string;
    x: number;
    y: number;
    location: {
        lat: number;
        lng: number;
    };
}>;
export type AddPoiRequest = z.infer<typeof AddPoiRequestSchema>;
export declare const ApiErrorSchema: z.ZodObject<{
    error: z.ZodString;
    message: z.ZodString;
    statusCode: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    message: string;
    error: string;
    statusCode: number;
}, {
    message: string;
    error: string;
    statusCode: number;
}>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
//# sourceMappingURL=schemas.d.ts.map