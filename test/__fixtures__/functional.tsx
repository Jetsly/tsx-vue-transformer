export const text = 'foo';
export const noop = _ => _;
const Test: any = { render: () => null };
const Test1: any = {
  render(h) {
    return <div/>;
  },
};

const Test2: any = {
  render(h) {
    return <div>{this.$slots.default}</div>;
  },
};

export const ContainsText = {
  render(h) {
    return <div>test</div>;
  },
};

export const BindsText = {
  render(h) {
    return <div>{text}</div>;
  },
};

export const ExtractsAttrs = {
  render(h) {
    return <div id="hi" dir="ltr" />;
  },
};

export const BindsAttrs = {
  render(h) {
    return <div id={text} />;
  },
};

export const HandlesTopLevelSpecialAttrs = {
  render(h) {
    return <div class={text} style="bar" key="key" ref="ref" refInFor slot="slot" />;
  },
};

export const HandlesNestedProperties = {
  render(h) {
    return (
      <div
        props-on-success={noop}
        on-click={noop}
        on-kebab-case={noop}
        domProps-innerHTML="<p>hi</p>"
        hook-insert={noop}
      />
    );
  },
};

export const HandlesNestedPropertiesCamelCase = {
  render(h) {
    return (
      <div
        propsOnSuccess={noop}
        onClick={noop}
        onCamelCase={noop}
        domPropsInnerHTML="<p>hi</p>"
        hookInsert={noop}
      />
    );
  },
};

export const SupportsDataAttribute = {
  render(h) {
    return <div data-id="1" />;
  },
};

export const HandlesIdentifierTagNameAsComponents = {
  render(h) {
    return <Test />;
  },
};

export const WorksForComponentsWithChildren = {
  render(h) {
    return (
      <Test1>
        <div>hi</div>
      </Test1>
    );
  },
};

export const BindsThingsInThunkWithCorrectThisContext = {
  data: () => ({ test: 'foo' }),
  render(h) {
    return <Test2>{this.test}</Test2>;
  },
};
