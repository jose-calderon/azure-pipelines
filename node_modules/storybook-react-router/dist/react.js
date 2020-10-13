'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StoryRouter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _addonActions = require('@storybook/addon-actions');

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var match = function match(link, path) {
  // If the new path matches with one of the keys defined in the links object, then
  // executes the given corresponding callback value with the path as argument.
  // As behind the scene matchProps uses path-to-regexp (https://goo.gl/xgzOaL)
  // you can use parameter names and regexp within the link keys.
  return (0, _reactRouter.matchPath)(link, { path: path, exact: true });
};

var StoryRouter = function StoryRouter(_ref) {
  var children = _ref.children,
      links = _ref.links,
      routerProps = _ref.routerProps;
  return (
    // Limitation: as MemoryRouter creates a new history object, you cannot pass it from
    // a story to another one and so you cannot implement a back or forward button which
    // works among stories.
    _react2.default.createElement(
      _reactRouter.MemoryRouter,
      routerProps,
      _react2.default.createElement(_reactRouter.Route, {
        render: function render(_ref2) {
          var history = _ref2.history,
              location = _ref2.location;
          return _react2.default.createElement(
            HistoryWatcher,
            { history: history, location: location, links: links },
            children
          );
        }
      })
    )
  );
};

StoryRouter.propTypes = {
  links: _propTypes2.default.object,
  routerProps: _propTypes2.default.object,
  children: _propTypes2.default.node
};

var HistoryWatcher = function (_Component) {
  _inherits(HistoryWatcher, _Component);

  function HistoryWatcher(props) {
    _classCallCheck(this, HistoryWatcher);

    var _this = _possibleConstructorReturn(this, (HistoryWatcher.__proto__ || Object.getPrototypeOf(HistoryWatcher)).call(this, props));

    _this.onHistoryChanged = _this.onHistoryChanged.bind(_this);
    return _this;
  }

  _createClass(HistoryWatcher, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // React on every change to the history
      this.unlisten = this.props.history.listen(this.onHistoryChanged);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      // If an exception occurs during a custom componentDidMount hook the
      // HistoryWatcher::componentDidMount method will not be called and so
      // the unlisten method will not be defined.
      if (!this.unlisten) {
        return;
      }

      this.unlisten();
    }
  }, {
    key: 'onHistoryChanged',
    value: function onHistoryChanged(location, historyAction) {
      var path = location.pathname;
      var links = this.props.links;


      for (var link in links) {
        if (match(path, link)) {
          links[link](path);
          return;
        }
      }
      (0, _addonActions.action)(historyAction ? historyAction : location.action)(path);
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return HistoryWatcher;
}(_react.Component);

HistoryWatcher.propTypes = {
  history: _propTypes2.default.object.isRequired,
  location: _propTypes2.default.object.isRequired,
  links: _propTypes2.default.object,
  children: _propTypes2.default.node
};

var storyRouterDecorator = function storyRouterDecorator(links, routerProps) {
  var s = function s(story) {
    return _react2.default.createElement(
      StoryRouter,
      { links: links, routerProps: routerProps },
      story()
    );
  };
  s.displayName = 'StoryRouter';
  return s;
};

exports.StoryRouter = StoryRouter;
exports.default = storyRouterDecorator;