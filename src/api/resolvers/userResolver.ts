// TODO: Add resolvers for user

import {GraphQLError} from 'graphql';
import userModel from '../models/userModel';
import {User} from '../../interfaces/User';

// 1. Queries
export default {
  Query: {
    // 1.1. users
    users: async (): Promise<User[]> => {
      return await userModel.find();
    },
    // 1.2. userById
    userById: async (_parent: undefined, args: {id: string}): Promise<User> => {
      const user = await userModel.findById(args.id);
      if (!user) {
        throw new GraphQLError('Category not found');
      }
      return user;
    },
  },
  // 2. Mutations
  Mutation: {
    // 2.1. createUser
    createUser: async (
      _parent: undefined,
      args: {user_name: Pick<User, 'user_name'>; email: Pick<User, 'email'>}
    ): Promise<{user_name?: string; email?: string; id?: any}> => {
      const user = await userModel.create({
        user_name: args.user_name,
        email: args.email,
      });
      if (user) {
        return {
          id: user.id,
          user_name: user.user_name,
          email: user.email,
        };
      }
      return {};
    },
    // 2.2. updateUser
    updateUser: async (
      _parent: undefined,
      args: {user_name: string; id: string}
    ): Promise<{user_name?: string; email?: string; id?: any}> => {
      const user = await userModel.findByIdAndUpdate(
        args.id,
        {
          user_name: args.user_name,
        },
        {
          new: true,
        }
      );
      if (user) {
        return {
          id: user.id,
          user_name: user.user_name,
          email: user.email,
        };
      }
      return {};
    },
    // 2.3. deleteUser
    deleteUser: async (
      _parent: undefined,
      args: {id: string}
    ): Promise<{id?: string; user_name?: string; email?: string}> => {
      const user = await userModel.findByIdAndDelete(args.id);
      if (user) {
        return {
          id: user.id,
          user_name: user.user_name,
          email: user.email,
        };
      }
      return {};
    },
  },
};
