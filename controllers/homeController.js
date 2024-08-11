const HomeService = require('../services/homeService')

class Home {
    async getHome(req, res){
        res.send(HomeService.getHome())
    }
}

module.exports = new Home();