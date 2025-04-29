import type { PropsWithChildren } from "react";
import Delegate, {
  type RenderFunction,
  type RenderRules,
} from "react-native-markdown-display";
import { Text } from "~/components/ui/text";

function missingRenderFunction(key: string): RenderFunction {
  return (node) => {
    throw new Error(
      `missing render function ${key} for node=${JSON.stringify(node)}`,
    );
  };
}

// See https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/renderRules.js and the associated styles
//     https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/styles.js
// for the original definitions
const renderRules: RenderRules = {
  blockquote: missingRenderFunction("blockquote"),
  blocklink: missingRenderFunction("blocklink"),
  // body: the main container. Don't override.
  bullet_list: missingRenderFunction("bullet_list"),
  code_block: missingRenderFunction("code_block"),
  code_inline: missingRenderFunction("code_inline"),
  em: missingRenderFunction("em"),
  fence: missingRenderFunction("fence"),
  hardbreak: missingRenderFunction("hardbreak"),
  heading1: missingRenderFunction("heading1"),
  heading2: missingRenderFunction("heading2"),
  heading3: missingRenderFunction("heading3"),
  heading4: missingRenderFunction("heading4"),
  heading5: missingRenderFunction("heading5"),
  heading6: missingRenderFunction("heading6"),
  hr: missingRenderFunction("hr"),
  image: missingRenderFunction("image"),
  inline: missingRenderFunction("inline"),
  link: missingRenderFunction("link"),
  list_item: missingRenderFunction("list_item"),
  ordered_list: missingRenderFunction("ordered_list"),
  pre: missingRenderFunction("pre"),
  s: missingRenderFunction("s"),
  softbreak: missingRenderFunction("softbreak"),
  span: missingRenderFunction("span"),
  strong: missingRenderFunction("strong"),
  table: missingRenderFunction("table"),
  thead: missingRenderFunction("thead"),
  tbody: missingRenderFunction("tbody"),
  td: missingRenderFunction("td"),
  text: (node) => <Text key={node.key}>{node.content}</Text>,
  textgroup: (node, children) => <Text key={node.key}>{children}</Text>,
  th: missingRenderFunction("th"),
  tr: missingRenderFunction("tr"),
  unknown: missingRenderFunction("unknown"),
};

export function Markdown({ children }: PropsWithChildren) {
  return <Delegate rules={renderRules}>{children}</Delegate>;
}
