var buildAPIUrl = function(e, t) {
    var r = "https://api.untappd.com/v4/",
      n = "?client_id=BEE5D99036C1A685A993F03F2112D91372339C48&client_secret=923B3926CB8482D5AF8CCC7661929E129DA4FAC0";
    return r + e + t + n
  },
  app = app || {};
app.Beer = Backbone.Model.extend({}), app.User = Backbone.Model.extend({
  defaults: {
    user_name: "" //used for defaulting to a certain username
  },
  url: function() {
    var e = this.get("user_name");
    return buildAPIUrl("user/info/", e)
  },
  parse: function(e) {
    return e.response.user
  }
});

var app = app || {};
app.BeerList = Backbone.Collection.extend({
  model: app.Beer,
  parse: function(e) {
    return e.response.beers.items
  }
});

var app = app || {};
app.UserView = Backbone.View.extend({
  el: "#user",
  template: _.template($("#user-template").html()),
  initialize: function() {
    this.listenTo(this.model, "change reset", this.render)
  },
  events: {
    "click #view-recent-beers-btn": "viewBeers"
  },
  render: function() {
    return this.$el.html(this.template(this.model.toJSON())), this
  },
  viewBeers: function() {
    var e = new app.BeerList,
      t = new app.BeerListView({
        collection: e
      });
    e.url = buildAPIUrl("user/beers/", this.model.get("user_name")), e.fetch({
      reset: !0
    }), $("#beers").html(t.el)
  }
}), app.BeerView = Backbone.View.extend({
  tagName: "article",
  className: "beer",
  template: _.template($("#beer-template").html()),
  attributes: function() {
    return {
      "data-beer-style": this.model.get("beer").beer_style,
      "data-beer-abv": this.model.get("beer").beer_abv
    }
  },
  render: function() {
    return this.$el.html(this.template(this.model.toJSON())), this
  }
}), app.BeerListView = Backbone.View.extend({
  tagName: "section",
  initialize: function() {
    this.listenTo(this.collection, "reset", this.addBeers)
  },
  addBeer: function(e) {
    var t = new app.BeerView({
      model: e
    });
    this.$el.append(t.render().el)
  },
  addBeers: function() {
    this.collection.each(function(e) {
      this.addBeer(e)
    }, this)
  }
}), app.SearchUserView = Backbone.View.extend({
  el: "#user-name-form",
  events: {
    submit: "searchUser"
  },
  searchUser: function() {
    var e = $("#user-name").val();
    $("#user").html(""), $("#beers").html(""); {
      var t = new app.User({
        user_name: e
      });
      new app.UserView({
        model: t
      })
    }
    return t.fetch({
      reset: !0
    }), !1
  }
});
var app = app || {};
app.AppView = Backbone.View.extend({
  initialize: function() {
    {
      var e = (new app.SearchUserView, new app.User);
      new app.UserView({
        model: e
      })
    }
    e.fetch({
      reset: !0
    })
  }
}), $(function() {
  new app.AppView
});
