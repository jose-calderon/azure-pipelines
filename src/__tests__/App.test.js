import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import { Route } from 'react-router-dom';
import Login from '../apps/PlanogramEditor/scenes/login/Login';

describe('App js renders routes', () => {

  it('renders correct routes', () => {
    const wrapper = shallow(<App />);
    const pathMaps = wrapper.find(Route).reduce((pathMap, route) => {
      const routeProps = route.props();
      const pathmap = pathMap;
      pathmap[routeProps.path] = routeProps.component;
      return pathmap;
    }, {});
    expect(pathMaps['/']).toBe(Login);
  });
});
