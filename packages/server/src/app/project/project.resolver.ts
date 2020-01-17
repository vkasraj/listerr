import {
    Query,
    Resolver,
    FieldResolver,
    Ctx,
    Root,
    Arg,
    Mutation,
    Field,
    InputType,
    Authorized,
    Args,
    Info,
} from "type-graphql";
import { GraphQLResolveInfo } from "graphql";
import { Types } from "mongoose";
import { Project, ProjectConnection } from "./project.schema";
import { ProjectService } from "./project.service";
import { User, AuthRolesEnum } from "../user/user.schema";
import { AppContext } from "../../utils/schema/context";
import { Column } from "../column/column.schema";
import {
    FindInput,
    TitleAndDescSchema,
    RearrangeColumnInput,
    ColumnIDInput,
    Filters,
} from "../shared/shared.schema";
import { ConnectionArgsType } from "../../utils/schema/connection";

@InputType()
export class CreateProjectInput extends TitleAndDescSchema {
    @Field({
        description: `Template ID for the project`,
    })
    templateID: Types.ObjectId;
}

@InputType()
export class RearrangeColumnFindInput extends ColumnIDInput {
    @Field()
    projectID: Types.ObjectId;
}

@Resolver(() => ProjectConnection)
export class ProjectConnectionResolver {
    // Field Resolvers ==========================================================
    @FieldResolver(() => Number)
    closedCount(@Ctx() ctx: AppContext, @Info() info: GraphQLResolveInfo) {
        return new ProjectService(ctx, info).closedCount();
    }

    @FieldResolver(() => Number)
    openCount(@Ctx() ctx: AppContext, @Info() info: GraphQLResolveInfo) {
        return new ProjectService(ctx, info).openCount();
    }

    // Resolvers ==========================================================
    @Authorized<AuthRolesEnum[]>([AuthRolesEnum.USER])
    @Query(() => ProjectConnection)
    async projectConnections(
        @Ctx() ctx: AppContext,
        @Info() info: GraphQLResolveInfo,
        @Args() args: ConnectionArgsType,
        @Arg("filters") filters: Filters
    ) {
        return new ProjectService(ctx, info).filters(filters).paginated(args);
    }
}

@Resolver(() => Project)
export class ProjectResolver {
    // Field Resolvers ==========================================================
    @FieldResolver(() => User)
    async createdBy(
        @Ctx() ctx: AppContext,
        @Root() { userID }: Project
    ): Promise<User> {
        return ctx.userLoader.load(userID as Types.ObjectId);
    }

    @FieldResolver(() => [Column])
    async columns(
        @Ctx() ctx: AppContext,
        @Root() { columnIDs }: Project
    ): Promise<(Column | Error)[]> {
        return ctx.columnLoader.loadMany(columnIDs as Types.ObjectId[]);
    }

    // Resolvers ==========================================================
    @Authorized<AuthRolesEnum[]>([AuthRolesEnum.USER])
    @Query(() => [Project], {
        nullable: "items",
    })
    async projects(
        @Ctx() ctx: AppContext,
        @Info() info: GraphQLResolveInfo,
        @Arg("filters") filters: Filters
    ): Promise<Project[]> {
        return new ProjectService(ctx, info).filters(filters).projects();
    }

    @Authorized<AuthRolesEnum[]>([AuthRolesEnum.USER])
    @Query(() => Project, {
        nullable: true,
    })
    async project(
        @Ctx() ctx: AppContext,
        @Info() info: GraphQLResolveInfo,
        @Arg("where") { _id }: FindInput
    ): Promise<Project> {
        return new ProjectService(ctx, info).project(_id);
    }

    @Authorized<AuthRolesEnum[]>([AuthRolesEnum.USER])
    @Mutation(() => Project)
    async createProject(
        @Ctx() ctx: AppContext,
        @Info() info: GraphQLResolveInfo,
        @Arg("data") data: CreateProjectInput
    ): Promise<Project> {
        return new ProjectService(ctx, info).createProject(data);
    }

    @Authorized<AuthRolesEnum[]>([AuthRolesEnum.USER])
    @Mutation(() => Boolean)
    async rearrangeColumn(
        @Ctx() ctx: AppContext,
        @Info() info: GraphQLResolveInfo,
        @Arg("where") where: RearrangeColumnFindInput,
        @Arg("data") data: RearrangeColumnInput
    ): Promise<boolean> {
        return new ProjectService(ctx, info).rearrangeColumn(where, data);
    }
}
