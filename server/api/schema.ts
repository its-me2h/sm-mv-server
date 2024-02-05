import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLFloat, GraphQLInt, GraphQLID } from 'graphql';
import { User } from './../src/models/user';
import { Post } from './../src/models/post';
import { Comment } from './../src/models/comment';
import { Bookmark } from './../src/models/bookmark';
import { Plan } from './../src/models/plan';
import { Pro } from './../src/models/pro';
import { Team } from './../src/models/team';
import { Sport } from './../src/models/sport';
import { Like } from './../src/models/like';
import { Subscription } from './../src/models/subscription';
import { Follow } from './../src/models/follow';
// import { User, Team, Pro, Sport, Subscription, Post, Like, Comment, Bookmark, Follow, Plan } from './../src/models/*';

const UserType: GraphQLObjectType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        isPro: { type: GraphQLBoolean },
        userName: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        avatarURL: { type: GraphQLString },
        coverURL: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
        pro: {
            type: ProType,
            resolve(parent) {
                return Pro.findByPk(parent.id);
            },
        },
    }),
});

const TeamType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Team',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        mediaURL: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    }),
});

const SportType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Sport',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        mediaURL: { type: GraphQLString },
        countPros: { type: GraphQLInt },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
        pro: {
            type: new GraphQLList(ProType),
            resolve: (parent, args) => {
                return Pro.findAll({ where: { sportId: parent.id } });
            },
        },
    }),
});

const ProType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Pro',
    fields: () => ({
        id: { type: GraphQLID },
        bio: { type: GraphQLString },
        sportId: { type: GraphQLID },
        teamId: { type: GraphQLID },
        countPosts: { type: GraphQLInt },
        countFollowers: { type: GraphQLInt },
        countSubscribers: { type: GraphQLInt },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
        sport: {
            type: SportType,
            resolve(parent) {
                return Sport.findByPk(parent.sportId);
            },
        },
        team: {
            type: TeamType,
            resolve(parent) {
                return Team.findByPk(parent.teamId);
            },
        },
        user: {
            type: UserType,
            resolve(parent) {
                return User.findByPk(parent.id);
            },
        },
        post: {
            type: new GraphQLList(PostType),
            args: {
                limit: { type: GraphQLInt },
            },
            async resolve(parent, args, context) {
                const JWTId = 1
                const posts = await Post.findAll({ where: { proId: parent.id } });
                const filteredPosts = await Promise.all(posts.map(async (post: any) => {
                    if (post.isPublic) {
                        return post;
                    } else {
                        const userSubscription = await Subscription.findOne({
                            where: {
                                userId: JWTId,
                            },
                            include: [{
                                model: Plan,
                                where: { proId: parent.id },
                            }],
                        });

                        if (userSubscription) {
                            return post;
                        } else {
                            return { ...post.dataValues, mediaURL: 'https://i.postimg.cc/ncQcXwQw/the-blurred-819388-1280.webp' };
                            // return { ...post.dataValues, mediaURL: null };
                        }
                    }
                }));
                return filteredPosts;
            },
        },
        isFollowing: {
            type: GraphQLBoolean,
            resolve: async (parent, args) => {
                const JWTId = 1
                const isFollowing = await Follow.findOne({
                    where: {
                        userId: JWTId,
                        proId: parent.id,
                    },
                });

                return isFollowing !== null;
            },
        },
        isSubscribing: {
            type: GraphQLBoolean,
            resolve: async (parent, args) => {
                const JWTId = 1
                const isSubscriber = await Subscription.findOne({
                    where: {
                        userId: JWTId,
                    },
                    include: [{
                        model: Plan,
                        where: { proId: parent.id },
                    }],
                });
                return isSubscriber !== null;
            },
        },
    }),
});

const FollowType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Follow',
    fields: () => ({
        id: { type: GraphQLID },
        user: {
            type: UserType,
            resolve(parent) {
                return User.findByPk(parent.userId);
            },
        },
        pro: {
            type: ProType,
            resolve(parent) {
                return Pro.findByPk(parent.proId);
            },
        },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    }),
});

const SubscriptionType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Subscription',
    fields: () => ({
        id: { type: GraphQLID },
        userId: { type: GraphQLID },
        planId: { type: GraphQLID },
        status: { type: GraphQLString },
        startDate: { type: GraphQLString },
        endDate: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    }),
});

const PlanType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Plan',
    fields: () => ({
        id: { type: GraphQLID },
        pro: {
            type: ProType,
            resolve(parent) {
                return Pro.findByPk(parent.proId);
            },
        },
        price: { type: GraphQLFloat },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    }),
});

const PostType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: GraphQLID },
        pro: {
            type: ProType,
            resolve(parent) {
                return Pro.findByPk(parent.proId);
            },
        },
        content: { type: GraphQLString },
        isPublic: { type: GraphQLBoolean },
        mediaURL: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    }),
});

const LikeType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Like',
    fields: () => ({
        id: { type: GraphQLID },
        post: {
            type: PostType,
            resolve(parent) {
                return Post.findByPk(parent.postId);
            },
        },
        user: {
            type: UserType,
            resolve(parent) {
                return User.findByPk(parent.userId);
            },
        },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    }),
});

const CommentType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
        id: { type: GraphQLID },
        post: {
            type: PostType,
            resolve(parent) {
                return Post.findByPk(parent.postId);
            },
        },
        user: {
            type: UserType,
            resolve(parent) {
                return User.findByPk(parent.userId);
            },
        },
        content: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    }),
});

const BookmarkType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Bookmark',
    fields: () => ({
        id: { type: GraphQLID },
        post: {
            type: PostType,
            resolve(parent) {
                return Post.findByPk(parent.postId);
            },
        },
        user: {
            type: UserType,
            resolve(parent) {
                return User.findByPk(parent.userId);
            },
        },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    }),
});

// Root Query
const RootQuery: GraphQLObjectType = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // Query to get a user by ID
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return User.findByPk(args.id);
            },
        },

        // Query to get a sport by ID
        sport: {
            type: new GraphQLList(SportType),
            args: {
                id: { type: GraphQLID },
                limit: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return args.id ? [Sport.findByPk(args.id)] : Sport.findAll({ limit: args.limit });
            },
        },

        // Query to get a pro by ID
        pro: {
            type: new GraphQLList(ProType),
            args: {
                id: { type: GraphQLID },
                limit: { type: GraphQLInt }
            },
            resolve(parent, args) {
                console.log('perrrrr')
                return args.id ? [Pro.findByPk(args.id)] : Pro.findAll({ limit: args.limit });
            },
        },






        // Query to get a team by ID
        getTeam: {
            type: TeamType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Team.findByPk(args.id);
            },
        },





        // Query to get a plan by ID
        getPlan: {
            type: PlanType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Plan.findByPk(args.id);
            },
        },

        // Query to get a follow by ID
        getFollow: {
            type: FollowType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Follow.findByPk(args.id);
            },
        },

        // Query to get a subscription by ID
        getSubscription: {
            type: SubscriptionType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Subscription.findByPk(args.id);
            },
        },

        // Query to get a post by ID
        getPost: {
            type: PostType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Post.findByPk(args.id);
            },
        },

        // Query to get a like by ID
        getLike: {
            type: LikeType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Like.findByPk(args.id);
            },
        },

        // Query to get a comment by ID
        getComment: {
            type: CommentType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Comment.findByPk(args.id);
            },
        },

        // Query to get a bookmark by ID
        getBookmark: {
            type: BookmarkType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Bookmark.findByPk(args.id);
            },
        },

        // Add other queries as needed
    },
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addSubscription: {
            type: SubscriptionType,
            args: {
                planId: { type: GraphQLID },
            },
            resolve(parent, args) {
                const newSubscription = {
                    id: Math.ceil(Math.random() * 1000),
                    userId: 1,
                    planId: args.planId,
                    status: 'active',
                    startDate: new Date(),
                    endDate: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                return newSubscription;
            },
        },
    },
});


const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
})
export default schema
