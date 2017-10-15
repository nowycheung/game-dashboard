(function(window) {
    var STORAGE_VERSION = "v1";

    var DashboardUtils = {
        getGameIcon: function(shortName) {
            return "https://royal1.midasplayer.com/images/games/" + shortName + "/" + shortName + "_170x80.gif";
        },

        getLoadingIcon: function() {
            return "https://www.goldderby.com/wp-content/themes/vip/pmc-goldderby/assets/images/loading.gif";
        },

        fetch: function(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    callback(JSON.parse(xhr.responseText));
                }
            };
            xhr.open("GET", url, true);
            xhr.send();
        },

        setData: function(dataKey, newData) {
            localStorage.setItem(STORAGE_VERSION + dataKey, JSON.stringify(newData));
        },

        getData: function(dataKey) {
            return JSON.parse(localStorage.getItem(STORAGE_VERSION + dataKey) || "{}");
        },

        generateGameObject: function(games, favoriteList) {
            return games.map(function(game) {
                game.isFavorite = favoriteList[game.short] || false;
                game.lazyLoadImage = {
                    src: DashboardUtils.getGameIcon(game.short),
                    loading: DashboardUtils.getLoadingIcon()
                };
                game.dataAPI = JSON.stringify({
                    name: "updateFavorite",
                    data: game.short
                });
                return game;
            }).reduce(function(prev, next) {
                prev[next.short] = next;
                return prev;
            }, {});
        },

        getError: function (currentPage) {
            switch (currentPage) {
                case "store":
                    return {
                        class: "no-games-error",
                        message: "Games not found"
                    };
                break;
                case "portfolio":
                    return {
                        class: "no-portfolio-error",
                        message: "You don't have any portfolio games"
                    };
                break;
            }
            return false;
        },

        apiHandler: function(api, element, dashboard, vue) {
            switch (api.name) {
                case "updatePage":
                    var currentPage = api.data;

                    vue.set(dashboard, "currentPage", currentPage);
                    DashboardUtils.setData("currentPage", {name: currentPage});
                break;
                case "updateFavorite":
                    var key = api.data;
                    var game =  dashboard.gamesObject[key];
                    var favoriteList = DashboardUtils.getData("favoriteList");

                    game.isFavorite = !game.isFavorite;

                    if (!game.isFavorite) {
                        delete favoriteList[game.short];
                    } else {
                        favoriteList[game.short] = true;
                    }

                    vue.set(dashboard.gamesObject, key, game);
                    vue.set(dashboard, "favoriteList", favoriteList);

                    DashboardUtils.setData("favoriteList", favoriteList);
                break;
            }
        },

        filterGame: function (data) {
            var gamesKey = data.gamesKey;
            var gamesObject = data.gamesObject;
            var search = data.search;
            var currentPage = data.currentPage;

            return gamesKey.filter(function(key) {
                var game = gamesObject[key];
                var macthedKeyWords = (new RegExp(search, "ig")).test(game.name);

                if (currentPage === "portfolio") {
                    return macthedKeyWords && game.isFavorite;
                }

                return macthedKeyWords;
            });
        }
    };

    window.DashboardUtils = DashboardUtils;
})(this);