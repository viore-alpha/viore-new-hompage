import { Fragment, type ReactNode } from "react";

/* Shows the product name "알파닥" / "Alphadoc" in the Alphadoc color inside running copy.
   "AlphaDoc Engine" and "AlphaDocument" are other technologies and keep the text color. */
const brandPattern = /(알파닥|Alphadoc)/;

export function withAlphadocName(text: string): ReactNode {
  const parts = text.split(brandPattern);
  if (parts.length === 1) return text;
  return parts.map((part, index) => (
    index % 2 === 1
      ? <span className="brand-alphadoc" key={index}>{part}</span>
      : <Fragment key={index}>{part}</Fragment>
  ));
}
