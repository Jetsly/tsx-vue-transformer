export const ContainsText = {
  render(h) {
    return <div>test</div>;
  },
};

const text = 'foo';

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
