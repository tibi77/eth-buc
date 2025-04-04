import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type InvoicesDocument = Invoices & Document;

@Schema({
    collection: "invoices",
    timestamps: true,
})
export class Invoices {
    @Prop({ type: SchemaTypes.ObjectId })
    _id: Types.ObjectId;

    @Prop({ required: true, type: String, enum: ["paid", "pending"] })
    status: "paid" | "pending";

    @Prop({ required: true, type: String })
    userWallet: string;

    @Prop({ required: true, type: String })
    requestId: string;

    @Prop({ required: true, type: String })
    paymentReference: string;

    @Prop({ required: true })
    invoice_id: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ required: true, type: Date, default: Date.now })
    updatedAt: Date;
}


const InvoiceSchema = SchemaFactory.createForClass(Invoices);
InvoiceSchema.index({
    user_id: 1,
    _id: 1,
});

export { InvoiceSchema };

