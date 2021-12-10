const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }
  static get idColumn() {
    return 'id';
  }
}

class Listing extends Model {
    static get tableName() {
      return 'dupe_listings';
    }
    static get idColumn() {
        return 'id';
    }
    static relationMappings = {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'dupe_listings.poster_id',
          to: 'users.id'
        }
      }
    };
}
  
module.exports = {
  listingModel : Listing
};