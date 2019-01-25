import { shallowMount } from '@vue/test-utils';
import { ContainsText, BindsText, ExtractsAttrs, BindsAttrs } from './__fixtures__/functional';

test('Contains text', () => {
  const wrapper = shallowMount(ContainsText);
  expect(wrapper.is('div')).toBeTruthy();
  expect(wrapper.text()).toEqual('test');
});

test('Binds text', () => {
  const wrapper = shallowMount(BindsText);
  expect(wrapper.is('div')).toBeTruthy();
  expect(wrapper.text()).toEqual('foo');
});

test('Extracts attrs', () => {
  const wrapper = shallowMount(ExtractsAttrs);
  expect(wrapper.element.id).toEqual('hi');
  expect(wrapper.element.dir).toEqual('ltr');
});
