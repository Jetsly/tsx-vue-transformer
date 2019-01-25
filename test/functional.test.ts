import { shallowMount } from '@vue/test-utils';
import { ContainsText, BindssText } from './__fixtures__/functional';

test('Contains text', () => {
  const wrapper = shallowMount(ContainsText);
  expect(wrapper.is('div')).toBeTruthy();
  expect(wrapper.text()).toEqual('test');
});

test('Binds text', () => {
  const wrapper = shallowMount(BindssText);
  expect(wrapper.is('div')).toBeTruthy();
  expect(wrapper.text()).toEqual('foo');
});
