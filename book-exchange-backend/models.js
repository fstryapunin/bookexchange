const { Model } = require('objection');

class Listing extends Model {
    static get tableName() {
      return 'someTableName';
    }
    static get idColumn() {
        return 'id';
    }
}
  
module.exports = MinimalModel;