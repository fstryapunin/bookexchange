const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }
  static get idColumn() {
    return 'id';
  }
}

class Tag extends Model {
  static get tableName() {
    return 'tags';
  }
  static get idColumn() {
    return 'id';
  }
}

class Listing extends Model {
    static get tableName() {
      return 'listings';
    }
    static get idColumn() {
        return 'id';
    }
    static relationMappings = {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'listings.poster_id',
          to: 'users.id'
        }
      },
      tags: {
        relation: Model.ManyToManyRelation,
        modelClass: Tag,
        join: {
          from: 'listings.id',
          through: {          
          from: 'listing_tags.listing_id',
          to: 'listing_tags.tag_id'
          },
        to: 'tags.id'
        }
      }
    };
}
  
module.exports = {
  listingModel : Listing
};