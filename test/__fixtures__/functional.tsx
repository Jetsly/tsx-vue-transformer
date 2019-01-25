export const text = 'foo';
export const noop = _ => _

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
