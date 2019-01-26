import { shallowMount } from '@vue/test-utils';
import {
  noop,
  text,
  ContainsText,
  BindsText,
  ExtractsAttrs,
  BindsAttrs,
  HandlesTopLevelSpecialAttrs,
  HandlesNestedProperties,
  HandlesNestedPropertiesCamelCase,
  SupportsDataAttribute,
  HandlesIdentifierTagNameAsComponents,
  WorksForComponentsWithChildren,
  BindsThingsInThunkWithCorrectThisContext,
} from './__fixtures__/functional';

test('Contains text', () => {
  const wrapper = shallowMount(ContainsText) as any;
  expect(wrapper.is('div')).toBeTruthy();
  expect(wrapper.text()).toEqual('test');
  expect(wrapper.vnode.data).toEqual(undefined);
});

test('Binds text', () => {
  const wrapper = shallowMount(BindsText) as any;
  expect(wrapper.is('div')).toBeTruthy();
  expect(wrapper.text()).toEqual(text);
  expect(wrapper.vnode.data).toEqual(undefined);
});

test('Extracts attrs', () => {
  const wrapper = shallowMount(ExtractsAttrs) as any;
  expect(wrapper.element.id).toEqual('hi');
  expect(wrapper.element.dir).toEqual('ltr');
  expect(wrapper.vnode.children).toEqual(undefined);
});

test('Binds attrs', () => {
  const wrapper = shallowMount(BindsAttrs) as any;
  expect(wrapper.element.id).toEqual(text);
  expect(wrapper.vnode.children).toEqual(undefined);
});

test('Handles top-level special attrs', () => {
  const wrapper = shallowMount(HandlesTopLevelSpecialAttrs) as any;
  expect(wrapper.vnode.data.class).toEqual(text);
  expect(wrapper.vnode.data.style).toEqual('bar');
  expect(wrapper.vnode.data.key).toEqual('key');
  expect(wrapper.vnode.data.ref).toEqual('ref');
  expect(wrapper.vnode.data.refInFor).toEqual(true);
  expect(wrapper.vnode.data.slot).toEqual('slot');
});

test('Handles nested properties', () => {
  const wrapper = shallowMount(HandlesNestedProperties) as any;
  expect(wrapper.vnode.data.props['on-success']).toEqual(noop);
  expect(wrapper.vnode.data.on.click.fns).toEqual(noop);
  expect(wrapper.vnode.data.on['kebab-case'].fns).toEqual(noop);
  expect(wrapper.vnode.data.domProps.innerHTML).toEqual('<p>hi</p>');
  expect(wrapper.vnode.data.hook.insert).toEqual(noop);
});

test('Handles nested properties (camelCase)', () => {
  const wrapper = shallowMount(HandlesNestedPropertiesCamelCase) as any;
  expect(wrapper.vnode.data.props.onSuccess).toEqual(noop);
  expect(wrapper.vnode.data.on.click.fns).toEqual(noop);
  expect(wrapper.vnode.data.on.camelCase.fns).toEqual(noop);
  expect(wrapper.vnode.data.domProps.innerHTML).toEqual('<p>hi</p>');
  expect(wrapper.vnode.data.hook.insert).toEqual(noop);
});

test('Supports data attribute', () => {
  const wrapper = shallowMount(SupportsDataAttribute) as any;
  expect(wrapper.vnode.data.attrs['data-id']).toEqual('1');
});

test('Handles identifier tag name as components', () => {
  const wrapper = shallowMount(HandlesIdentifierTagNameAsComponents) as any;
  expect(wrapper.vnode.tag).toContain('vue-component');
});

test('Works for components with children', () => {
  const wrapper = shallowMount(WorksForComponentsWithChildren) as any;

  const children = wrapper.vnode.componentOptions.children;
  expect(children[0].tag).toBe('div');
});

test('Binds things in thunk with correct this context', () => {
  const wrapper = shallowMount(BindsThingsInThunkWithCorrectThisContext);

  expect(wrapper.html()).toEqual('<div>foo</div>');
});
