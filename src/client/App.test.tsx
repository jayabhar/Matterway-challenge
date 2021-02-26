import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

describe('<App/>', () => {
  it('Test Input', () => {
    const appWrapper = shallow(<App />);
    console.log(appWrapper)
    expect(appWrapper.find('input')).toHaveLength(1);
  });
});