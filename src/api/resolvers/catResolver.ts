// TODO: Add resolvers for cat
import catModel from '../models/catModel';
import {Cat} from '../../interfaces/Cat';
import {User} from '../../interfaces/User';

// 1. Queries
const catResolver = {
  Query: {
    // 1.1. cats
    cats: async (): Promise<Cat[]> => {
      return await catModel.find();
    },
    // 1.2. catById
    catById: async (_parent: undefined, args: {id: string}): Promise<Cat> => {
      const cat = await catModel.findById(args.id);
      if (!cat) {
        throw new Error('Cat not found');
      }
      return cat;
    },
    // 1.3. catsByOwner
    catsByOwner: async (
      _parent: undefined,
      args: {ownerId: string}
    ): Promise<Cat[]> => {
      const cats = await catModel.find({owner: args.ownerId});
      if (!cats) {
        throw new Error('Cat not found');
      }
      return cats;
    },
    // 1.4. catsByArea
    catsByArea: async (
      _parent: undefined,
      args: {
        topRight: {lat: number; lng: number};
        bottomLeft: {
          lat: number;
          lng: number;
        };
      }
    ): Promise<Cat[]> => {
      const cats = await catModel.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [
                (args.topRight.lng + args.bottomLeft.lng) / 2,
                (args.topRight.lat + args.bottomLeft.lat) / 2,
              ],
              $maxDistance: 1000,
            },
          },
        },
      });
      if (!cats) {
        throw new Error('Cat not found');
      }
      return cats;
    },
  },
  // 2. Mutations
  Mutation: {
    // 2.1. createCat
    createCat: async (
      _parent: undefined,
      args: {
        cat_name: Pick<Cat, 'cat_name'>;
        weight: Pick<Cat, 'weight'>;
        birthdate: Pick<Cat, 'birthdate'>;
        owner: Pick<User, 'id'>;
        location: Pick<Cat, 'location'>;
        filename: Pick<Cat, 'filename'>;
      }
    ): Promise<Partial<Cat>> => {
      const cat = await catModel.create({
        cat_name: args.cat_name,
        weight: args.weight,
        birthdate: args.birthdate,
        filename: args.filename,
        location: args.location,
        owner: args.owner,
      });
      if (cat) {
        return cat;
      }
      return {};
    },
    // 2.2. updateCat
    updateCat: async (
      _parent: undefined,
      args: {
        id: string;
        cat_name: Pick<Cat, 'cat_name'>;
        weight: Pick<Cat, 'weight'>;
        birthdate: Pick<Cat, 'birthdate'>;
      }
    ): Promise<Partial<Cat>> => {
      const cat = await catModel.findByIdAndUpdate(
        args.id,
        {
          cat_name: args.cat_name,
          weight: args.weight,
          birthdate: args.birthdate,
        },
        {
          new: true,
        }
      );
      if (cat) {
        return cat;
      }
      return {};
    },
    // 2.3. deleteCat
    deleteCat: async (
      _parent: undefined,
      args: {id: string}
    ): Promise<Partial<Cat>> => {
      const cat = await catModel.findByIdAndDelete(args.id);
      if (cat) {
        return cat;
      }
      return {};
    },
  },
};

export default catResolver;
