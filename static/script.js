(function(window) {
    // Image lazy load
    Vue.use(VueLazyload);

    // Horizontal Menu Config
    var pages = [{
        id: "store",
        text: "Store",
        dataAPI: JSON.stringify({"name":"updatePage","data":"store"})
    }, {
        id: "portfolio",
        text: "Portfolio",
        dataAPI: JSON.stringify({"name":"updatePage","data":"portfolio"})
    }];

    var Utils = window.DashboardUtils,
        favoriteList = Utils.getData("favoriteList"),
        currentPage = Utils.getData("currentPage").name || pages[0].id,
        response = Utils.getData("games-response"),
        gamesObject = Utils.generateGameObject(response.games || [], favoriteList);

    var DashboardApp = new Vue({
        el: "#DashboardApp",
        data: {
            search: "",
            pages: pages,
            currentPage: currentPage,
            favoriteList: favoriteList,
            gamesKey: Object.keys(gamesObject),
            gamesObject: gamesObject
        },
        computed: {
            filteredGamesKey: function() {
                return Utils.filterGame(this);
            },
            error: function() {
                return this.filteredGamesKey.length === 0 && Utils.getError(this.currentPage);
            },
            favoriteListCount: function() {
                return Object.keys(this.favoriteList).length;
            }
        }
    });

    Utils.fetch("./games.json", function(response) {
        var updatedGamesObject = Utils.generateGameObject(response.games, Utils.getData("favoriteList"));

        Vue.set(DashboardApp, "gamesKey", Object.keys(updatedGamesObject));
        Vue.set(DashboardApp, "gamesObject", updatedGamesObject);
        Utils.setData("games-response", response);
    });

    // "Home made" API
    window.document.body.onclick = function(event) {
        if (event.target.dataset.api) {
            var api = JSON.parse(event.target.dataset.api);
            Utils.apiHandler(api, event.target, DashboardApp, Vue);
        }
    };
})(this);