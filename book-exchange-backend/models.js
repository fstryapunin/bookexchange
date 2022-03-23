const { Model } = require('objection');
const { db } = require('./middleware/knex')

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

class Image extends Model {
  static get tableName() {
    return 'user_images'
  }
  static get idColumn() {
    return 'id';
  }
}

class Message extends Model {
  static get tableName() {
    return 'messages'
  }
  static get idColumn() {
    return 'id';
  }
  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'messages.addressant',
        to: 'users.id'
      }
    }
  }
}

class Conversation extends Model {
  static get tableName() {
    return 'conversations';
  }
  static get idColumn() {
      return 'id';
  }
  static relationMappings = {
    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'conversations.creator_id',
        to: 'users.id'
      }
    },
    users: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      join: {
        from: 'conversations.id',
        through: {          
        from: 'user_conversations.conversation_id',
        to: 'user_conversations.user_id'
        },
      to: 'users.id'
      }
    },
    messages: {
      relation: Model.HasManyRelation,
      modelClass: Message,
      join: {
        from: 'conversations.id',       
        to: 'messages.conversation_id'
      }
    },
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
      images: {
        relation: Model.HasManyRelation,
        modelClass: Image,
        join: {
          from: 'listings.id',
          to: 'user_images.listing_id'
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

//bind objection models to knex db config
Model.knex(db)
  
module.exports = {
  listingModel: Listing,
  conversationModel: Conversation,
  messageModel: Message
};