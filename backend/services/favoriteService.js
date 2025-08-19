const favoritesModel = require("../models/favorite");

class FavoriteService {
  async addFavorite(gameid, userId) {
    favoritesModel.createFavorite(gameid, userId);
  }
}

module.exports = new FavoriteService();