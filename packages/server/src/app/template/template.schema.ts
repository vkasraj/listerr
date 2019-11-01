import { ObjectType, Field, ID } from "type-graphql";
import { prop, getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Column } from "../column/column.schema";

@ObjectType()
export class Template {
    @Field(() => ID)
    _id: Types.ObjectId;

    @Field()
    @prop({
        required: true,
        minlength: 5,
        maxlength: 50,
    })
    title: string;

    @Field()
    @prop({
        required: true,
        minlength: 10,
        maxlength: 200,
    })
    description: string;

    @Field(() => [Column])
    @prop({
        required: true,
    })
    columns: Column[];
}

export const TemplateModel = getModelForClass(Template, {
    schemaOptions: {
        timestamps: true,
        minimize: true,
    },
});
